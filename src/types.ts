export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ListenerOptions = { capture?: boolean; passive?: boolean };

export type PointerType = 'mouse' | 'pen' | 'touch';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RectExtended extends Rect {
  right: number;
  bottom: number;
}
