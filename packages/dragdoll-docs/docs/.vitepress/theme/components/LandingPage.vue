<script setup>
import { useData } from 'vitepress';
import LandingDemo from './LandingDemo.vue';
import HeroGlow from './HeroGlow.vue';

const { site } = useData();
const base = site.value.base || '/';
</script>

<template>
  <div class="landing">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">DragDoll</h1>
          <p class="hero-tagline">The drag and drop library that doesn't hold you back.</p>
          <p class="hero-description">
            A modular, high-performance drag &amp; drop system built in TypeScript. Sensors,
            draggables, droppables, and collision detection &mdash; all modular, all
            framework-agnostic, all fast.
          </p>
          <div class="hero-actions">
            <a :href="`${base}getting-started`" class="btn btn-primary">Get Started</a>
            <a
              href="https://github.com/niklasramo/dragdoll"
              class="btn btn-secondary"
              target="_blank"
              rel="noopener"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <div class="hero-demo">
          <LandingDemo />
        </div>
      </div>
      <HeroGlow />
    </section>

    <!-- Features -->
    <section class="features">
      <div class="features-container">
        <h2 class="section-title">Built Different</h2>
        <p class="section-subtitle">
          Everything you need for world-class drag and drop, nothing you don't.
        </p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="--accent: #ff5555">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 12a10 10 0 0 1 18-6" />
                <path d="M22 12a10 10 0 0 1-18 6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3>Sweet Sensors</h3>
            <p>
              Pointer, keyboard, or roll your own. Sensors normalize any input into unified drag
              events, giving you complete control over interactions.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="--accent: #55ff9c">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 4h4v4" />
                <path d="M10 20H6v-4" />
                <path d="m18 4-7 7" />
                <path d="m6 20 7-7" />
              </svg>
            </div>
            <h3>Dynamic Draggables</h3>
            <p>
              A highly customizable Draggable system with autoscrolling superpowers, drag previews,
              and position modifiers. Complex scenarios made effortless.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="--accent: #db55ff">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3>Collision Detection</h3>
            <p>
              An extendable, cache-optimized collision detection system you can build on. Ships with
              a visibility-aware detector that handles overflow clipping and scroll containers for
              you.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="--accent: #7cbdff">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <path d="M8 9.5c.4-.5 1.2-.5 1.6 0" />
                <path d="M14.4 9.5c.4-.5 1.2-.5 1.6 0" />
              </svg>
            </div>
            <h3>Blissful DX</h3>
            <p>
              Smart defaults get you moving fast. Rich events and extension points give you full
              control when you need it.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="--accent: #f9ff9e">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
              </svg>
            </div>
            <h3>Magical Transforms</h3>
            <p>
              Finally, transformed elements can be dragged normally. Rotate, scale, skew to your
              heart's content.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="--accent: #ff9555">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Uncompromising Performance</h3>
            <p>
              Pooled events, batched DOM reads/writes, cached measurements. Your users won't notice
              the performance. That's the point.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Framework Support -->
    <section class="frameworks">
      <div class="frameworks-container">
        <h2 class="section-title">Framework Support</h2>
        <p class="section-subtitle">Use DragDoll your way.</p>
        <div class="frameworks-grid">
          <a :href="`${base}getting-started`" class="framework-card framework-card-available">
            <div class="framework-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
                />
              </svg>
            </div>
            <div class="framework-name">Core</div>
            <div class="framework-status available">Available</div>
          </a>
          <a :href="`${base}react/`" class="framework-card framework-card-available">
            <div class="framework-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2.5" />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  transform="rotate(60 12 12)"
                />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  transform="rotate(120 12 12)"
                />
              </svg>
            </div>
            <div class="framework-name">React</div>
            <div class="framework-status available">Available</div>
          </a>
          <div class="framework-card framework-card-soon">
            <div class="framework-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"
                />
              </svg>
            </div>
            <div class="framework-name">Vue</div>
            <div class="framework-status soon">Coming Soon</div>
          </div>
          <div class="framework-card framework-card-soon">
            <div class="framework-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.109 4.109 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.286-.21a7.204 7.204 0 0 0-2.187-1.093l-.208-.063.02-.207a1.255 1.255 0 0 0-.226-.831 1.337 1.337 0 0 0-1.435-.532 1.231 1.231 0 0 0-.343.15L8.62 9.368a1.162 1.162 0 0 0-.524.778 1.24 1.24 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.235 1.235 0 0 0 .344-.151l2.132-1.36a4.067 4.067 0 0 1 1.135-.498 4.44 4.44 0 0 1 4.765 1.766 4.108 4.108 0 0 1 .702 3.108 3.857 3.857 0 0 1-1.742 2.583l-5.589 3.562a4.072 4.072 0 0 1-1.135.499m10.358-17.95C18.484-.015 14.082-.96 10.9 1.068L5.31 4.63a6.412 6.412 0 0 0-2.896 4.295 6.753 6.753 0 0 0 .666 4.336 6.43 6.43 0 0 0-.96 2.396 6.833 6.833 0 0 0 1.168 5.167c2.229 3.19 6.63 4.135 9.812 2.108l5.59-3.562a6.41 6.41 0 0 0 2.896-4.295 6.756 6.756 0 0 0-.665-4.336 6.429 6.429 0 0 0 .958-2.396 6.831 6.831 0 0 0-1.167-5.168Z"
                />
              </svg>
            </div>
            <div class="framework-name">Svelte</div>
            <div class="framework-status soon">Coming Soon</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bottom-cta">
      <h2>Ready to build?</h2>
      <p>Install DragDoll and start dragging in minutes.</p>
      <div class="install-snippet">
        <code>npm install dragdoll</code>
      </div>
      <div class="hero-actions" style="margin-top: 24px; justify-content: center">
        <a :href="`${base}getting-started`" class="btn btn-primary">Get Started</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing {
  --section-gap: 100px;
  max-width: 100%;
}

/* ===== Hero ===== */

.hero {
  position: relative;
  padding: 80px 24px 60px;
}

.hero-content {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}

.hero-text {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin: 0;
  text-wrap: balance;
}

.hero-demo {
  flex: 0 0 auto;
  width: 340px;
}

@media (max-width: 768px) {
  .hero {
    padding: 50px 20px 40px;
  }

  .hero-content {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }

  .hero-demo {
    width: 100%;
    max-width: 340px;
  }

  .hero-actions {
    justify-content: center;
  }
}

.hero-tagline {
  font-size: 20px;
  color: var(--vp-c-text-1);
  margin: 16px 0 12px;
  font-weight: 500;
  line-height: 1.4;
  text-wrap: balance;
}

.hero-description {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 28px;
  max-width: 500px;
  text-wrap: pretty;
}

@media (max-width: 768px) {
  .hero-description {
    max-width: 100%;
  }
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* ===== Buttons ===== */

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #000;
}

.btn-primary:hover {
  background: #ff7070;
  box-shadow: 0 4px 20px var(--dd-c-brand-a30);
}

.btn-secondary {
  background: var(--dd-c-white-a5);
  color: var(--vp-c-text-1);
  border: 1px solid var(--dd-c-white-a10);
}

.btn-secondary:hover {
  background: var(--dd-c-white-a10);
  border-color: var(--dd-c-white-a20);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* ===== Features ===== */

.features {
  padding: var(--section-gap) 24px;
}

.features-container {
  max-width: 960px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  text-wrap: balance;
}

.section-subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin-bottom: 48px;
  text-wrap: balance;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.feature-card {
  padding: 28px 24px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid var(--dd-c-white-a10);
}

.feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  margin-bottom: 16px;
}

.feature-icon svg {
  width: 22px;
  height: 22px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  text-wrap: balance;
}

.feature-card p {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  text-wrap: pretty;
}

/* ===== Frameworks ===== */

.frameworks {
  padding: 0 24px var(--section-gap);
}

.frameworks-container {
  max-width: 960px;
  margin: 0 auto;
}

.frameworks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .frameworks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.framework-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 16px;
  border-radius: 12px;
  border: 1px solid var(--dd-c-white-a10);
  background: transparent;
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.framework-card-available:hover {
  border-color: var(--dd-c-white-a30);
  background: transparent;
}

.framework-card-soon {
  opacity: 0.5;
}

.framework-icon {
  width: 40px;
  height: 40px;
  color: var(--vp-c-text-1);
}

.framework-icon svg {
  width: 100%;
  height: 100%;
}

.framework-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.framework-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 100px;
}

.framework-status.available {
  color: var(--dd-c-success);
  background: rgba(85, 255, 156, 0.1);
}

.framework-status.soon {
  color: var(--vp-c-text-3);
  background: var(--dd-c-white-a5);
}

/* ===== Bottom CTA ===== */

.bottom-cta {
  text-align: center;
  padding: 0 24px 100px;
}

.bottom-cta h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  text-wrap: balance;
}

.bottom-cta p {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  text-wrap: pretty;
}

.install-snippet {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--dd-c-white-a10);
}

.install-snippet code {
  font-size: 14px;
  color: var(--dd-c-code);
  font-family: var(--vp-font-family-mono);
}
</style>
