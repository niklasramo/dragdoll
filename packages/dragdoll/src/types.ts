export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ListenerOptions = { capture?: boolean; passive?: boolean };

export type PointerType = 'mouse' | 'pen' | 'touch';

export type Point = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export interface Rect extends Point, Dimensions {}

export interface RectFull extends Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type CSSProperties = Partial<
  Omit<
    CSSStyleDeclaration,
    | 'getPropertyPriority'
    | 'getPropertyValue'
    | 'item'
    | 'removeProperty'
    | 'setProperty'
    | 'length'
    | 'parentRule'
    | number
    | symbol
  >
>;
