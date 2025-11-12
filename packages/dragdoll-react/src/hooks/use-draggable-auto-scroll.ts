import type { Draggable, DraggableAutoScrollOptions, DraggablePluginMap, Sensor } from 'dragdoll';
import { autoScrollPlugin } from 'dragdoll';
import { useRef } from 'react';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

type DraggableWithAutoScroll<
  S extends Sensor[] = Sensor[],
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  P extends DraggablePluginMap = {},
> = ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null;

export function useDraggableAutoScroll<
  S extends Sensor[] = Sensor[],
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  P extends DraggablePluginMap = {},
>(draggable: Draggable<S, P> | null, settings?: DraggableAutoScrollOptions<S>) {
  // Store settings in ref for stable access in effects.
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Store applied settings for deep equality check.
  const appliedSettingsRef = useRef(settings);

  // Register plugin when draggable changes (only once per draggable instance)
  useIsomorphicLayoutEffect(() => {
    // If the draggable is not ready, return.
    if (!draggable) return;

    // If the plugin is already registered, skip registration.
    if (draggable.plugins.autoscroll) return;

    // Register the plugin.
    draggable.use(autoScrollPlugin(settingsRef.current));

    // Update the applied settings.
    appliedSettingsRef.current = settingsRef.current;
  }, [draggable]);

  // Update settings when settings change.
  useIsomorphicLayoutEffect(() => {
    const plugin = (draggable as DraggableWithAutoScroll<S, P>)?.plugins.autoscroll;
    if (!plugin) return;

    // Only update if settings have actually changed (deep equality check).
    // This prevents unnecessary updates when settings object reference changes
    // but values remain the same.
    if (!areConfigsEqual(appliedSettingsRef.current, settings)) {
      // Here we use the protected method to parse the settings so that we can
      // use the default settings for the ones that are not provided. This is the
      // expected behavior in React's declarative nature.
      plugin.updateSettings(plugin['_parseSettings'](settings));
    }

    // Update the applied settings.
    appliedSettingsRef.current = settings;
  }, [draggable, settings]);

  // Return typed draggable with plugin
  return draggable as DraggableWithAutoScroll<S, P>;
}
