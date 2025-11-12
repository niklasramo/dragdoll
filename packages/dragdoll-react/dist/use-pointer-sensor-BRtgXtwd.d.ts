import { PointerSensor, PointerSensorEvents, PointerSensorSettings } from "dragdoll";

//#region src/hooks/use-pointer-sensor.d.ts
declare function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(settings?: Partial<PointerSensorSettings>, element?: Element | Window): readonly [PointerSensor<E> | null, (node: Element | null) => void];
//#endregion
export { usePointerSensor as t };
//# sourceMappingURL=use-pointer-sensor-BRtgXtwd.d.ts.map