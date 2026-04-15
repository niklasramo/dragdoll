import pkg from 'dragdoll/package.json' with { type: 'json' };
import pkgReact from 'dragdoll-react/package.json' with { type: 'json' };
import pkgSolid from 'dragdoll-solid/package.json' with { type: 'json' };

const { version } = pkg;
const { version: versionReact } = pkgReact;
const { version: versionSolid } = pkgSolid;

const SITE_URL = 'https://niklasramo.github.io/dragdoll/';

export default {
  base: '/dragdoll/',
  lang: 'en-US',
  title: 'DragDoll',
  description: 'Modular and extensible drag system.',
  appearance: 'force-dark',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/dragdoll/dragdoll-favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'DragDoll' }],
    ['meta', { property: 'og:title', content: 'DragDoll' }],
    ['meta', { property: 'og:description', content: 'Modular and extensible drag system.' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'DragDoll' }],
    ['meta', { name: 'twitter:description', content: 'Modular and extensible drag system.' }],
  ],
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
  sitemap: {
    hostname: SITE_URL,
  },
  transformPageData(pageData) {
    // Build canonical URL for the page.
    const canonicalUrl = `${SITE_URL}${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '');

    // Initialize head array if it doesn't exist.
    pageData.frontmatter.head ??= [];

    // Add canonical link.
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }]);

    // Add page-specific Open Graph URL.
    pageData.frontmatter.head.push(['meta', { property: 'og:url', content: canonicalUrl }]);
  },
  themeConfig: {
    logo: '/dragdoll-logo.svg',
    siteTitle: '',
    nav: nav(),
    sidebar: {
      '/': sidebarMain(),
      '/react/': sidebarReact(),
      '/solid/': sidebarSolid(),
    },
    outline: [2, 3],
    editLink: {
      pattern: 'https://github.com/niklasramo/dragdoll/edit/main/packages/dragdoll-docs/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/niklasramo/dragdoll' },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
        },
        link: 'https://github.com/sponsors/niklasramo',
        ariaLabel: 'Fund DragDoll on GitHub',
      },
    ],
    footer: {
      message: 'DragDoll is released under the MIT License.',
      copyright: `Copyright © 2022-${new Date().getFullYear()} Niklas Rämö`,
    },
    search: {
      provider: 'local',
    },
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },
    // algolia: {
    //   appId: 'xxxxx',
    //   apiKey: 'xxxxx',
    //   indexName: 'dragdoll',
    // },
    // carbonAds: {
    //   code: "xxxxx",
    //   placement: "xxxxx",
    // },
  },
};

function nav() {
  return [];
}

function sidebarMain() {
  return [
    {
      text: `Core v${version}`,
      collapsible: false,
      items: [
        { text: 'Introduction', link: '/introduction' },
        { text: 'Getting Started', link: '/getting-started' },
        { text: 'Tips and Tricks', link: '/tips-and-tricks' },
        { text: 'Accessibility', link: '/accessibility' },
        { text: 'Drag Patterns', link: '/drag-patterns' },
        { text: 'Examples', link: '/examples' },
      ],
    },
    {
      text: 'Sensors',
      collapsible: false,
      items: [
        { text: 'Sensor', link: '/sensor' },
        { text: 'BaseSensor', link: '/base-sensor' },
        { text: 'BaseMotionSensor', link: '/base-motion-sensor' },
        { text: 'PointerSensor', link: '/pointer-sensor' },
        { text: 'KeyboardSensor', link: '/keyboard-sensor' },
        { text: 'KeyboardMotionSensor', link: '/keyboard-motion-sensor' },
      ],
    },
    {
      text: 'Draggable',
      collapsible: false,
      items: [
        {
          text: 'Draggable',
          link: '/draggable',
          collapsible: false,
          items: [
            { text: 'DraggableDrag', link: '/draggable-drag' },
            { text: 'DraggableDragItem', link: '/draggable-drag-item' },
          ],
        },
        {
          text: 'Helpers',
          link: '/draggable-helpers',
          collapsible: false,
        },
        {
          text: 'Modifiers',
          link: '/draggable-modifiers',
          collapsible: false,
          items: [
            { text: 'Containment', link: '/draggable-containment-modifier' },
            { text: 'Snap', link: '/draggable-snap-modifier' },
            { text: 'Start Offset', link: '/draggable-start-offset-modifier' },
          ],
        },
        {
          text: 'Plugins',
          link: '/draggable-plugins',
          collapsible: false,
          items: [{ text: 'AutoScroll', link: '/draggable-auto-scroll-plugin' }],
        },
      ],
    },
    {
      text: 'Droppable',
      collapsible: false,
      items: [{ text: 'Droppable', link: '/droppable' }],
    },
    {
      text: 'DndObserver',
      collapsible: false,
      items: [
        {
          text: 'DndObserver',
          link: '/dnd-observer',
          collapsible: false,
          items: [
            { text: 'CollisionDetector', link: '/collision-detector' },
            { text: 'AdvancedCollisionDetector', link: '/advanced-collision-detector' },
          ],
        },
      ],
    },
    {
      text: 'Utils',
      collapsible: false,
      items: [
        { text: 'getElementTransformString', link: '/get-element-transform-string' },
        { text: 'getLocalOffset', link: '/get-local-offset' },
        { text: 'getStyle', link: '/get-style' },
        { text: 'getWorldTransformMatrix', link: '/get-world-transform-matrix' },
      ],
    },
    {
      text: 'Links',
      collapsible: false,
      items: [
        { text: 'Releases', link: 'https://github.com/niklasramo/dragdoll/releases' },
        {
          text: 'Contributing',
          link: 'https://github.com/niklasramo/dragdoll/blob/main/CONTRIBUTING.md',
        },
        { text: 'License', link: 'https://github.com/niklasramo/dragdoll/blob/main/LICENSE.md' },
      ],
    },
  ];
}

function sidebarReact() {
  return [
    {
      text: `React v${versionReact}`,
      collapsible: false,
      items: [
        { text: 'Introduction', link: '/react/' },
        { text: 'Getting Started', link: '/react/getting-started' },
        { text: 'Drag Patterns', link: '/react/drag-patterns' },
        { text: 'Examples', link: '/react/examples' },
      ],
    },
    {
      text: 'Sensors',
      collapsible: false,
      items: [
        { text: 'useKeyboardSensor', link: '/react/use-keyboard-sensor' },
        { text: 'useKeyboardMotionSensor', link: '/react/use-keyboard-motion-sensor' },
        { text: 'usePointerSensor', link: '/react/use-pointer-sensor' },
        { text: 'useSensorCallback', link: '/react/use-sensor-callback' },
      ],
    },
    {
      text: 'Draggable',
      collapsible: false,
      items: [
        { text: 'useDraggable', link: '/react/use-draggable' },
        { text: 'useDraggableCallback', link: '/react/use-draggable-callback' },
        { text: 'useDraggableDrag', link: '/react/use-draggable-drag' },
        { text: 'useDraggableAutoScroll', link: '/react/use-draggable-auto-scroll' },
        { text: 'useDragPreview', link: '/react/use-drag-preview' },
        { text: 'DragPreview', link: '/react/drag-preview' },
      ],
    },
    {
      text: 'Droppable',
      collapsible: false,
      items: [{ text: 'useDroppable', link: '/react/use-droppable' }],
    },
    {
      text: 'DndObserver',
      collapsible: false,
      items: [
        { text: 'DndObserverContext', link: '/react/dnd-observer-context' },
        { text: 'useDndObserver', link: '/react/use-dnd-observer' },
        { text: 'useDndObserverContext', link: '/react/use-dnd-observer-context' },
        { text: 'useDndObserverCallback', link: '/react/use-dnd-observer-callback' },
      ],
    },
  ];
}

function sidebarSolid() {
  return [
    {
      text: `Solid v${versionSolid}`,
      collapsible: false,
      items: [
        { text: 'Introduction', link: '/solid/' },
        { text: 'Getting Started', link: '/solid/getting-started' },
        { text: 'Drag Patterns', link: '/solid/drag-patterns' },
        { text: 'Examples', link: '/solid/examples' },
      ],
    },
    {
      text: 'Sensors',
      collapsible: false,
      items: [
        { text: 'useKeyboardSensor', link: '/solid/use-keyboard-sensor' },
        { text: 'useKeyboardMotionSensor', link: '/solid/use-keyboard-motion-sensor' },
        { text: 'usePointerSensor', link: '/solid/use-pointer-sensor' },
        { text: 'useSensorCallback', link: '/solid/use-sensor-callback' },
      ],
    },
    {
      text: 'Draggable',
      collapsible: false,
      items: [
        { text: 'useDraggable', link: '/solid/use-draggable' },
        { text: 'useDraggableCallback', link: '/solid/use-draggable-callback' },
        { text: 'useDraggableDrag', link: '/solid/use-draggable-drag' },
        { text: 'useDraggableAutoScroll', link: '/solid/use-draggable-auto-scroll' },
        { text: 'useDragPreview', link: '/solid/use-drag-preview' },
        { text: 'DragPreview', link: '/solid/drag-preview' },
      ],
    },
    {
      text: 'Droppable',
      collapsible: false,
      items: [{ text: 'useDroppable', link: '/solid/use-droppable' }],
    },
    {
      text: 'DndObserver',
      collapsible: false,
      items: [
        { text: 'DndObserverContext', link: '/solid/dnd-observer-context' },
        { text: 'useDndObserver', link: '/solid/use-dnd-observer' },
        { text: 'useDndObserverContext', link: '/solid/use-dnd-observer-context' },
        { text: 'useDndObserverCallback', link: '/solid/use-dnd-observer-callback' },
      ],
    },
  ];
}
