<script setup>
import { useRoute, useRouter, withBase } from 'vitepress';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const isReact = computed(() => route.path.includes('/react/'));

function navigate(path) {
  router.go(withBase(path));
}
</script>

<template>
  <div class="framework-tab" :class="{ active: !isReact }">
    <button @click="navigate('/introduction')">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
        />
      </svg>
      Core
    </button>
  </div>
  <div class="framework-tab" :class="{ active: isReact }">
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
