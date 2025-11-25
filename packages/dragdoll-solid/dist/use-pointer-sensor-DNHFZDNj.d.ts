import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { Accessor } from "solid-js";
import { PointerSensor, PointerSensorEvents, PointerSensorSettings } from "dragdoll/sensors/pointer";

//#region src/hooks/use-pointer-sensor.d.ts
declare function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(settings?: MaybeAccessor<Partial<PointerSensorSettings> | undefined>, element?: MaybeAccessor<Element | Window | null>): readonly [Accessor<PointerSensor<E> | null>, (node: Element | null) => void];
//#endregion
export { usePointerSensor as t };
//# sourceMappingURL=use-pointer-sensor-DNHFZDNj.d.ts.map