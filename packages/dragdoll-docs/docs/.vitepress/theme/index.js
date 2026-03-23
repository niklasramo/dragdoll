import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import FrameworkSwitcher from './components/FrameworkSwitcher.vue';
import LandingPage from './components/LandingPage.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h(FrameworkSwitcher),
    });
  },
  enhanceApp({ app }) {
    app.component('LandingPage', LandingPage);
  },
};
