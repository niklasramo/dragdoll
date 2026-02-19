import { describe, expect, it } from 'vitest';
import { areConfigsEqual } from '../../dragdoll-react/src/utils/are-configs-equal.js';

describe('areConfigsEqual', () => {
  describe('primitives', () => {
    it('should return true for identical primitives', () => {
      expect(areConfigsEqual(1, 1)).toBe(true);
      expect(areConfigsEqual('a', 'a')).toBe(true);
      expect(areConfigsEqual(true, true)).toBe(true);
      expect(areConfigsEqual(null, null)).toBe(true);
      expect(areConfigsEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(areConfigsEqual(1, 2)).toBe(false);
      expect(areConfigsEqual('a', 'b')).toBe(false);
      expect(areConfigsEqual(true, false)).toBe(false);
      expect(areConfigsEqual(null, undefined)).toBe(false);
    });

    it('should handle NaN correctly', () => {
      expect(areConfigsEqual(NaN, NaN)).toBe(true);
      expect(areConfigsEqual(NaN, 1)).toBe(false);
    });

    it('should handle +0 and -0', () => {
      expect(areConfigsEqual(0, -0)).toBe(false);
    });

    it('should return true for same reference', () => {
      const fn = () => {};
      expect(areConfigsEqual(fn, fn)).toBe(true);
    });
  });

  describe('arrays', () => {
    it('should return true for equal arrays', () => {
      expect(areConfigsEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(areConfigsEqual([], [])).toBe(true);
    });

    it('should return false for arrays with different lengths', () => {
      expect(areConfigsEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should return false for arrays with different values', () => {
      expect(areConfigsEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it('should handle nested arrays', () => {
      expect(areConfigsEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
      expect(areConfigsEqual([[1, 2], [3]], [[1, 2], [4]])).toBe(false);
    });

    it('should return false when comparing array to non-array', () => {
      expect(areConfigsEqual([1], { 0: 1 })).toBe(false);
      expect(areConfigsEqual({ 0: 1 }, [1])).toBe(false);
    });
  });

  describe('sets', () => {
    it('should return true for equal sets', () => {
      expect(areConfigsEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
      expect(areConfigsEqual(new Set(), new Set())).toBe(true);
    });

    it('should return true for sets with same values in different order', () => {
      expect(areConfigsEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
    });

    it('should return false for sets with different sizes', () => {
      expect(areConfigsEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false);
    });

    it('should return false for sets with different values', () => {
      expect(areConfigsEqual(new Set([1, 2, 3]), new Set([1, 2, 4]))).toBe(false);
    });

    it('should return false when comparing set to non-set', () => {
      expect(areConfigsEqual(new Set([1]), [1])).toBe(false);
      expect(areConfigsEqual([1], new Set([1]))).toBe(false);
    });
  });

  describe('plain objects', () => {
    it('should return true for equal objects', () => {
      expect(areConfigsEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(areConfigsEqual({}, {})).toBe(true);
    });

    it('should return false for objects with different keys', () => {
      expect(areConfigsEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(areConfigsEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('should return false for objects with different values', () => {
      expect(areConfigsEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should handle nested objects', () => {
      expect(areConfigsEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(areConfigsEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it('should handle objects with arrays and sets', () => {
      expect(
        areConfigsEqual(
          { items: [1, 2], groups: new Set(['a', 'b']) },
          { items: [1, 2], groups: new Set(['b', 'a']) },
        ),
      ).toBe(true);
    });
  });

  describe('non-plain objects', () => {
    it('should return false for class instances', () => {
      class Foo {
        value = 1;
      }
      expect(areConfigsEqual(new Foo(), new Foo())).toBe(false);
    });

    it('should return false for null vs object', () => {
      expect(areConfigsEqual(null, {})).toBe(false);
      expect(areConfigsEqual({}, null)).toBe(false);
    });
  });
});
