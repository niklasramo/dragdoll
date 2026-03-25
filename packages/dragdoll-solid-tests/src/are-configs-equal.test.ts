// The areConfigsEqual utility is duplicated in dragdoll-solid but not exported.
// Import from the internal path for testing.
import { areConfigsEqual } from 'dragdoll-solid/dist/index.js';
import { describe, expect, it } from 'vitest';

describe('areConfigsEqual', () => {
  it('should return true for identical primitives', () => {
    expect(areConfigsEqual(1, 1)).toBe(true);
    expect(areConfigsEqual('a', 'a')).toBe(true);
    expect(areConfigsEqual(null, null)).toBe(true);
    expect(areConfigsEqual(undefined, undefined)).toBe(true);
  });

  it('should return false for different primitives', () => {
    expect(areConfigsEqual(1, 2)).toBe(false);
    expect(areConfigsEqual('a', 'b')).toBe(false);
    expect(areConfigsEqual(null, undefined)).toBe(false);
  });

  it('should return true for deeply equal objects', () => {
    expect(areConfigsEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(areConfigsEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
  });

  it('should return false for different objects', () => {
    expect(areConfigsEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(areConfigsEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('should return true for equal arrays', () => {
    expect(areConfigsEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('should return false for different arrays', () => {
    expect(areConfigsEqual([1, 2], [1, 3])).toBe(false);
    expect(areConfigsEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('should handle Sets', () => {
    expect(areConfigsEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
    expect(areConfigsEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });
});
