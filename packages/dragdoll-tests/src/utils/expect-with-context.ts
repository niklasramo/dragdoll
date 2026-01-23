/**
 * Wraps Jest-style expect() with context messages for better failure identification.
 *
 * Usage:
 *   expectWithContext(value, 'drag should be null').toBe(null);
 *   expectWithContext(obj, 'event data matches').toStrictEqual({ x: 1, y: 2 });
 */
export function expectWithContext<T>(actual: T, context: string) {
  return {
    toBe(expected: T) {
      try {
        expect(actual).toBe(expected);
      } catch (e: unknown) {
        if (e instanceof Error) {
          e.message = `[${context}] ${e.message}`;
        }
        throw e;
      }
    },
    toStrictEqual(expected: T) {
      try {
        expect(actual).toStrictEqual(expected);
      } catch (e: unknown) {
        if (e instanceof Error) {
          e.message = `[${context}] ${e.message}`;
        }
        throw e;
      }
    },
    not: {
      toBe(expected: T) {
        try {
          expect(actual).not.toBe(expected);
        } catch (e: unknown) {
          if (e instanceof Error) {
            e.message = `[${context}] ${e.message}`;
          }
          throw e;
        }
      },
      toStrictEqual(expected: T) {
        try {
          expect(actual).not.toStrictEqual(expected);
        } catch (e: unknown) {
          if (e instanceof Error) {
            e.message = `[${context}] ${e.message}`;
          }
          throw e;
        }
      },
    },
  };
}
