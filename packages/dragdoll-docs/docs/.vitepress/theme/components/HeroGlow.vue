<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
let gl = null;
let program = null;
let animationId = null;
let startTime = 0;
let resizeObserver = null;
let uTimeLoc = null;
let uResLoc = null;

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

// Simplex-style 2D noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Early discard — skip pixels outside the visible glow radius
  vec2 center = uv - 0.5;
  float cheapDist = dot(center, center);
  if (cheapDist > 0.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec2 p = center * 2.0;

  // Aspect ratio correction
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.15;

  // Layered noise for organic movement
  float n1 = fbm(p * 1.2 + vec2(t * 0.7, t * 0.5));
  float n2 = fbm(p * 0.8 - vec2(t * 0.4, t * 0.6));
  float n = (n1 + n2) * 0.5;

  // Remap noise to 0..1 range
  n = n * 0.5 + 0.5;

  // Radial falloff — elliptical, wider than tall
  float dist = length(p * vec2(0.7, 1.0));
  float falloff = smoothstep(1.4, 0.0, dist);

  // Fade to transparent at canvas edges
  float edgeFade = smoothstep(0.0, 0.15, uv.x) * smoothstep(0.0, 0.15, 1.0 - uv.x)
                 * smoothstep(0.0, 0.15, uv.y) * smoothstep(0.0, 0.25, 1.0 - uv.y);
  falloff *= edgeFade;

  // Red glow with slight warm variation
  vec3 red = vec3(1.0, 0.33, 0.33);
  vec3 warmRed = vec3(1.0, 0.25, 0.18);
  vec3 color = mix(red, warmRed, n) * n * falloff;

  // Intensity control — keep it subtle
  color *= 0.1;

  // Output as premultiplied alpha so edges blend seamlessly into the page bg
  float a = max(color.r, max(color.g, color.b));
  gl_FragColor = vec4(color, a);
}
`;

function initGL(canvasEl) {
  gl = canvasEl.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl) return false;

  // Compile shaders
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, VERT);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, FRAG);
  gl.compileShader(fs);

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('HeroGlow: WebGL program failed to link');
    return false;
  }

  gl.useProgram(program);

  // Cache uniform locations — avoid per-frame lookups
  uTimeLoc = gl.getUniformLocation(program, 'u_time');
  uResLoc = gl.getUniformLocation(program, 'u_resolution');

  // Fullscreen quad
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Delete shader objects after linking — GPU keeps the compiled program
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  return true;
}

let canvasW = 0;
let canvasH = 0;

function resize() {
  if (!canvas.value || !gl) return;
  const el = canvas.value;
  // Render at half DPR — the glow is soft/blurry so full resolution is wasted
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
  const w = Math.round(el.clientWidth * dpr);
  const h = Math.round(el.clientHeight * dpr);
  if (w === canvasW && h === canvasH) return;
  canvasW = w;
  canvasH = h;
  el.width = w;
  el.height = h;
  gl.viewport(0, 0, w, h);
  gl.uniform2f(uResLoc, w, h);
}

function render(time) {
  if (!gl || !program) return;
  gl.uniform1f(uTimeLoc, (time - startTime) / 1000);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  animationId = requestAnimationFrame(render);
}

onMounted(() => {
  if (!canvas.value) return;

  if (!initGL(canvas.value)) {
    // WebGL not available — fall back to CSS glow
    canvas.value.classList.add('fallback');
    return;
  }

  resize();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.value);

  startTime = performance.now();
  animationId = requestAnimationFrame(render);
});

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (resizeObserver) resizeObserver.disconnect();
  if (gl) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null;
  }
});
</script>

<template>
  <canvas ref="canvas" class="hero-glow-canvas" aria-hidden="true" />
</template>

<style scoped>
.hero-glow-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 140%;
  pointer-events: none;
  z-index: -1;
}

/* CSS fallback when WebGL is unavailable. */
.hero-glow-canvas.fallback {
  background: radial-gradient(ellipse at center, rgba(255, 85, 85, 0.1) 0%, transparent 70%);
}
</style>
