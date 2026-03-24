<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const SPRING_EASING =
  'linear(0, 0.05 1.5%, 0.54 8%, 0.88 14%, 1.04 18%, 1.15 21%, 1.07 25%, 0.96 30%, 1.02 36%, 1.01 45%, 0.99 55%, 1 70%, 1)';

let link = null;
let pulseInterval = null;
let isHovered = false;

// Pre-build a template node once — clone instead of parsing HTML per particle
let heartTemplate = null;
function getTemplate() {
  if (!heartTemplate) {
    heartTemplate = document.createElement('span');
    heartTemplate.setAttribute('aria-hidden', 'true');
    heartTemplate.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  }
  return heartTemplate;
}

function pulse() {
  if (!link || isHovered || document.activeElement === link) return;
  // Double-rAF avoids forced synchronous reflow
  link.style.animation = 'none';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (link) link.style.animation = `heart-pulse 1400ms ${SPRING_EASING}`;
    });
  });
}

function spawnHeart() {
  if (!link) return;

  const heart = getTemplate().cloneNode(true);

  const size = 6 + Math.random() * 8;
  const angle = Math.random() * Math.PI * 2;
  const distance = 20 + Math.random() * 30;
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;
  const duration = 800 + Math.random() * 600;

  const s = heart.style;
  s.cssText = `position:absolute;left:50%;top:50%;width:${size}px;height:${size}px;color:#ff3388;pointer-events:none;z-index:-1;margin-left:${-size / 2}px;margin-top:${-size / 2}px;will-change:transform,opacity;transition:transform ${duration}ms ease-out,opacity ${duration}ms ease-out`;

  link.appendChild(heart);

  // Single rAF to batch the style read/write
  requestAnimationFrame(() => {
    s.transform = `translate(${dx}px,${dy}px) scale(0.3)`;
    s.opacity = '0';
  });

  // Clean up after transition completes
  heart.addEventListener('transitionend', () => heart.remove(), { once: true });
}

function onEnter() {
  isHovered = true;
  link.style.animation = 'none';
  for (let i = 0; i < 6; i++) {
    spawnHeart();
  }
}

function onLeave() {
  isHovered = false;
}

onMounted(() => {
  link = document.querySelector(
    '.VPSocialLinks a[href="https://github.com/sponsors/niklasramo"]',
  );
  if (!link) return;
  link.addEventListener('mouseenter', onEnter);
  link.addEventListener('mouseleave', onLeave);
  pulseInterval = setInterval(pulse, 30000);
});

onBeforeUnmount(() => {
  if (pulseInterval) clearInterval(pulseInterval);
  if (!link) return;
  link.removeEventListener('mouseenter', onEnter);
  link.removeEventListener('mouseleave', onLeave);
});
</script>

<template>
  <span />
</template>
