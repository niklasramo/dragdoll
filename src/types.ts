export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ListenerOptions = { capture?: boolean; passive?: boolean };

export type PointerType = 'mouse' | 'pen' | 'touch';

export type Dimensions = {
  width: number;
  height: number;
};

export interface Rect extends Dimensions {
  left: number;
  top: number;
}

export interface RectExtended extends Rect {
  right: number;
  bottom: number;
}

export type FilterNotStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}`
  ? never
  : Set;

export type RemoveUnderscoreProperties<T extends {}> = Pick<T, FilterNotStartingWith<keyof T, '_'>>;

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
  >
>;
