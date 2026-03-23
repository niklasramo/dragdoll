<script setup>
import { useData } from 'vitepress';
import LandingDemo from './LandingDemo.vue';

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
            draggables, droppables, and collision detection &mdash; all composable, all
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
      <div class="hero-glow"></div>
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
                <path d="M2 20h.01" />
                <path d="M7 20v-4" />
                <path d="M12 20v-8" />
                <path d="M17 20V8" />
                <path d="M22 20V4" />
              </svg>
            </div>
            <h3>Sensor System</h3>
            <p>
              Pluggable sensors normalize any input &mdash; pointer, keyboard, or custom &mdash;
              into unified drag events.
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
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Blazing Performance</h3>
            <p>
              Pooled events, batched DOM reads/writes, cached measurements. Designed for 60fps from
              day one.
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
            <p>Advanced and composable collision detectors for precise drop target resolution.</p>
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
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>Fully Modular</h3>
            <p>
              Use only what you need. Sensors, draggables, droppables, and observers are independent
              building blocks.
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h3>Transform Support</h3>
            <p>Drag rotated, scaled, and skewed elements naturally. CSS transforms just work.</p>
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Type-Safe</h3>
            <p>Written in TypeScript with comprehensive types. Your IDE knows everything.</p>
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div class="framework-name">Vanilla / Core</div>
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
                <polyline points="2 15.5 12 8.5 22 15.5" />
                <line x1="12" y1="2" x2="12" y2="8.5" />
              </svg>
            </div>
            <div class="framework-name">Vue</div>
            <div class="framework-status soon">Coming Soon</div>
          </div>
          <div class="framework-card framework-card-soon">
            <div class="framework-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M10.354 21.125a4.44 4.44 0 0 0 4.765-1.765 4.109 4.109 0 0 0 .3-3.32 4.15 4.15 0 0 0 1.6-.825 4.225 4.225 0 0 0 1.35-3.34 4.37 4.37 0 0 0-2.36-3.9 4.43 4.43 0 0 0-.71-4.89A4.37 4.37 0 0 0 11.39 2a4.44 4.44 0 0 0-4.765 1.765 4.109 4.109 0 0 0-.3 3.32 4.15 4.15 0 0 0-1.6.825 4.225 4.225 0 0 0-1.35 3.34 4.37 4.37 0 0 0 2.36 3.9 4.43 4.43 0 0 0 .71 4.89 4.37 4.37 0 0 0 3.91 1.085z"
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
        <a :href="`${base}getting-started`" class="btn btn-primary">Read the Docs</a>
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
}

.hero-description {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 28px;
  max-width: 500px;
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

.hero-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse at center, rgba(255, 85, 85, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
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
  background: #ff5555;
  color: #000;
}

.btn-primary:hover {
  background: #ff7070;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(255, 85, 85, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  color: var(--vp-c-text-1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
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
}

.section-subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin-bottom: 48px;
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s ease;
}

.feature-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-2px);
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
}

.feature-card p {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
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
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.framework-card-available:hover {
  border-color: rgba(255, 85, 85, 0.3);
  background: rgba(255, 85, 85, 0.04);
  transform: translateY(-2px);
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
  color: #55ff9c;
  background: rgba(85, 255, 156, 0.1);
}

.framework-status.soon {
  color: var(--vp-c-text-3);
  background: rgba(255, 255, 255, 0.05);
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
}

.bottom-cta p {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
}

.install-snippet {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.install-snippet code {
  font-size: 14px;
  color: #7cbdff;
  font-family: var(--vp-font-family-mono);
}
</style>
