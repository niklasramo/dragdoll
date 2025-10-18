//#region src/types.d.ts

type ListenerOptions = {
  capture?: boolean;
  passive?: boolean;
};
type PointerType = 'mouse' | 'pen' | 'touch';
type Point = {
  x: number;
  y: number;
};
type Dimensions = {
  width: number;
  height: number;
};
interface Rect extends Point, Dimensions {}
type CSSProperties = Partial<Omit<CSSStyleDeclaration, 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty' | 'length' | 'parentRule' | number | symbol>>;
//#endregion
export { CSSProperties, ListenerOptions, Point, PointerType, Rect };
//# sourceMappingURL=types-CEK9qPqM.d.ts.map