<script setup>
import { useRoute, useRouter, withBase } from 'vitepress';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const activeFramework = computed(() => {
  if (route.path.includes('/react/')) return 'react';
  if (route.path.includes('/solid/')) return 'solid';
  return 'core';
});

function navigate(path) {
  router.go(withBase(path));
}
</script>

<template>
  <div class="framework-tab" :class="{ active: activeFramework === 'core' }">
    <button @click="navigate('/introduction')">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
        />
      </svg>
      Core
    </button>
  </div>
  <div class="framework-tab" :class="{ active: activeFramework === 'react' }">
    <button @click="navigate('/react/')">
      <svg
        class="switcher-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
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
      React
    </button>
  </div>
  <div class="framework-tab" :class="{ active: activeFramework === 'solid' }">
    <button @click="navigate('/solid/')">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.558.788A9.082 9.082 0 0 0 9.776.99l-.453.15c-.906.303-1.656.755-2.1 1.348l-.301.452-2.035 3.528c.426-.387.974-.698 1.643-.894h.001l.613-.154h.001a8.82 8.82 0 0 1 1.777-.206c2.916-.053 6.033 1.148 8.423 2.36 2.317 1.175 3.888 2.32 3.987 2.39L24 5.518c-.082-.06-1.66-1.21-3.991-2.386-2.393-1.206-5.521-2.396-8.45-2.343zM8.924 5.366a8.634 8.634 0 0 0-1.745.203l-.606.151c-1.278.376-2.095 1.16-2.43 2.108-.334.948-.188 2.065.487 3.116.33.43.747.813 1.216 1.147L12.328 10h.001a6.943 6.943 0 0 1 6.013 1.013l2.844-.963c-.17-.124-1.663-1.2-3.91-2.34-2.379-1.206-5.479-2.396-8.352-2.344zm5.435 4.497a6.791 6.791 0 0 0-1.984.283L2.94 13.189 0 18.334l9.276-2.992a6.945 6.945 0 0 1 7.408 2.314v.001c.695.903.89 1.906.66 2.808l2.572-4.63c.595-1.041.45-2.225-.302-3.429a6.792 6.792 0 0 0-5.255-2.543zm-3.031 5.341a6.787 6.787 0 0 0-2.006.283L.008 18.492c.175.131 2.02 1.498 4.687 2.768 2.797 1.332 6.37 2.467 9.468 1.712l.454-.152h.002c1.278-.376 2.134-1.162 2.487-2.09.353-.93.207-2.004-.541-2.978a6.791 6.791 0 0 0-5.237-2.548z"
        />
      </svg>
      Solid
    </button>
  </div>
</template>

<style scoped>
.framework-tab {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
  z-index: 0;

  &:first-of-type {
    margin-top: 8px;
  }

  &.active {
    position: sticky;
    top: 8px;
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      inset: -8px 0;
      background: var(--vp-sidebar-bg-color);
      z-index: 1;
    }
  }

  & > button {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 8px;
    padding: 4px 12px;
    border: 1px solid var(--dd-c-white-a20);
    border-radius: 8px;
    background: transparent;
    color: var(--vp-c-text-2);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--vp-font-family-base);
    width: 100%;
    z-index: 2;

    &:hover {
      color: var(--vp-c-text-1);
      background: transparent;
      border-color: var(--dd-c-white-a40);
    }

    .framework-tab.active & {
      color: var(--vp-c-brand-1);
      background: var(--dd-c-brand-a8);
      border-color: var(--vp-c-brand-1);

      &:hover {
        background: var(--dd-c-brand-a12);
      }
    }

    & > svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  }
}

@media (max-width: 768px) {
  .framework-tab {
    &:first-of-type {
      margin-top: 0;
    }

    &.active {
      top: 0px;
    }
  }
}
</style>
