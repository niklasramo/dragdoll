import type { AnyDraggable, DraggableDragItem } from 'dragdoll/draggable';
import type { Accessor, JSX } from 'solid-js';
import { createEffect, createRoot, onCleanup } from 'solid-js';
import { insert } from 'solid-js/web';
import { useDragPreview } from '../hooks/use-drag-preview.js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';

export interface DragPreviewRenderProps {
  draggable: AnyDraggable;
  item: DraggableDragItem | null;
  index: number;
  sourceElement: HTMLElement | SVGSVGElement;
  exiting: boolean;
  done: () => void;
}

export interface DragPreviewProps {
  draggable: MaybeAccessor<AnyDraggable | null>;
  children?: ((props: DragPreviewRenderProps) => JSX.Element) | JSX.Element;
}

// Renders content directly into drag preview proxy elements.
// Unlike Solid's Portal (which adds a wrapper div), this component
// uses low-level insert() to render directly into each proxy
// element, matching React's createPortal behavior and preserving
// proxy sizing set by createDragPreviewProxies.
export function DragPreview(props: DragPreviewProps) {
  const result = useDragPreview(props.draggable);

  // Track active render roots so we can dispose them on
  // cleanup.
  let disposeList: (() => void)[] = [];

  const cleanupRoots = () => {
    for (const dispose of disposeList) dispose();
    disposeList = [];
  };

  createEffect(() => {
    const state = result();

    // Clean up previous render roots.
    cleanupRoots();

    if (!state || !state.proxies.length) return;

    const { draggable, sources, proxies, exiting, done } = state;

    for (let i = 0; i < proxies.length; i++) {
      const proxyEl = proxies[i];
      const index = i;

      createRoot((dispose) => {
        disposeList.push(dispose);

        const content =
          typeof props.children === 'function'
            ? (props.children as (p: DragPreviewRenderProps) => JSX.Element)({
                draggable,
                item: draggable.drag?.items?.[index] ?? null,
                index,
                sourceElement: sources[index],
                exiting,
                done,
              })
            : props.children;

        // Clear any previous content (e.g. from the active
        // phase before exiting) then render into the proxy.
        proxyEl.textContent = '';
        insert(proxyEl, content as unknown as Accessor<JSX.Element>);
      });
    }
  });

  onCleanup(cleanupRoots);

  // This component renders nothing into its own position in the
  // DOM tree. All content is inserted directly into proxy
  // elements.
  return undefined as unknown as JSX.Element;
}
