import type { Draggable, DraggablePluginMap } from 'dragdoll/draggable';
import type { DraggableAutoScrollOptions } from 'dragdoll/draggable/plugins/auto-scroll';
import { autoScrollPlugin } from 'dragdoll/draggable/plugins/auto-scroll';
import type { Sensor } from 'dragdoll/sensors';
import type { Accessor } from 'solid-js';
import { createEffect, createMemo } from 'solid-js';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

type DraggableWithAutoScroll<
  S extends Sensor = Sensor,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  P extends DraggablePluginMap = {},
> = ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null;

export type UseDraggableAutoScrollSettings<S extends Sensor = Sensor> =
  DraggableAutoScrollOptions<S>;

export function useDraggableAutoScroll<
  S extends Sensor = Sensor,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  P extends DraggablePluginMap = {},
>(
  draggableInput: MaybeAccessor<Draggable<S, P> | null>,
  settingsInput?: MaybeAccessor<UseDraggableAutoScrollSettings<S> | undefined>,
): Accessor<DraggableWithAutoScroll<S, P>> {
  const resolvedDraggable = createMemo(() => resolveMaybeAccessor(draggableInput));
  const resolvedSettings = createMemo(
    () => resolveMaybeAccessor(settingsInput) as UseDraggableAutoScrollSettings<S> | undefined,
  );

  let appliedSettings = resolvedSettings();

  // Single effect handles both plugin registration (on draggable
  // change) and settings updates (on settings change). A split-effect
  // approach is fragile in Solid because both effects would track
  // resolvedSettings(), causing the registration effect to mutate
  // appliedSettings and hide real changes from the update effect.
  createEffect(() => {
    const draggable = resolvedDraggable();
    if (!draggable) return;

    const nextSettings = resolvedSettings();
    const plugin = (draggable as DraggableWithAutoScroll<S, P>)?.plugins.autoscroll;

    if (!plugin) {
      draggable.use(autoScrollPlugin<S, P>(nextSettings));
      appliedSettings = nextSettings;
      return;
    }

    if (areConfigsEqual(appliedSettings, nextSettings)) return;

    plugin.updateSettings(plugin['_parseSettings'](nextSettings));
    appliedSettings = nextSettings;
  });

  return resolvedDraggable as Accessor<DraggableWithAutoScroll<S, P>>;
}
