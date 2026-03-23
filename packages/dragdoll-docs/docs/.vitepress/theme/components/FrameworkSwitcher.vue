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
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
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
    border: 1px solid rgba(255, 255, 255, 0.15);
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
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .framework-tab.active & {
      color: var(--vp-c-brand-1);
      background: rgba(255, 85, 85, 0.08);
      border-color: var(--vp-c-brand-1);

      &:hover {
        background: rgba(255, 85, 85, 0.12);
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
