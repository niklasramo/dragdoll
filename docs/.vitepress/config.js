import { version } from '../../package.json';

export default {
  base: '/dragdoll/',
  lang: 'en-US',
  title: 'DragDoll',
  description: 'Modular and extensible drag system.',
  appearance: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/dragdoll-icon.svg' }]],
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
  themeConfig: {
    siteTitle: false,
    logo: '/dragdoll-logo.svg',
    nav: nav(),
    sidebar: {
      '/': sidebarGuide(),
    },
    outline: [2, 3],
    editLink: {
      pattern: 'https://github.com/niklasramo/dragdoll/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/niklasramo/dragdoll' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Niklas Rämö',
    },
    search: {
      provider: 'local',
    },
    /*
    algolia: {
      appId: 'xxxxx',
      apiKey: 'xxxxx',
      indexName: 'dragdoll',
    },
    */
    /*
    carbonAds: {
      code: "xxxxx",
      placement: "xxxxx",
    },
    */
  },
};

function nav() {
  return [
    { text: 'Home', link: '/' },
    { text: 'Docs', link: '/docs/getting-started', activeMatch: '/docs/' },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/niklasramo/dragdoll/releases',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/niklasramo/dragdoll/blob/master/CONTRIBUTING.md',
        },
      ],
    },
  ];
}

function sidebarGuide() {
  return [
    {
      collapsible: false,
      items: [
        { text: 'Getting Started', link: '/docs/getting-started' },
        { text: 'Examples', link: '/docs/examples' },
      ],
    },
    {
      text: 'Sensors',
      collapsible: false,
      items: [
        { text: 'Sensor', link: '/docs/sensor' },
        { text: 'BaseSensor', link: '/docs/base-sensor' },
        { text: 'BaseMotionSensor', link: '/docs/base-motion-sensor' },
        { text: 'PointerSensor', link: '/docs/pointer-sensor' },
        { text: 'KeyboardSensor', link: '/docs/keyboard-sensor' },
        { text: 'KeyboardMotionSensor', link: '/docs/keyboard-motion-sensor' },
      ],
    },
    {
      text: 'Draggable',
      collapsible: false,
      items: [
        {
          text: 'Draggable',
          link: '/docs/draggable',
          collapsible: false,
          items: [
            { text: 'DraggableDrag', link: '/docs/draggable-drag' },
            { text: 'DraggableDragItem', link: '/docs/draggable-drag-item' },
          ],
        },
        {
          text: 'Helpers',
          link: '/docs/draggable-helpers',
          collapsible: false,
        },
        {
          text: 'Modifiers',
          link: '/docs/draggable-modifiers',
          collapsible: false,
          items: [
            { text: 'Containment', link: '/docs/draggable-containment-modifier' },
            { text: 'Snap', link: '/docs/draggable-snap-modifier' },
          ],
        },
        {
          text: 'Plugins',
          link: '/docs/draggable-plugins',
          collapsible: false,
          items: [{ text: 'AutoScroll', link: '/docs/draggable-auto-scroll-plugin' }],
        },
      ],
    },
  ];
}
