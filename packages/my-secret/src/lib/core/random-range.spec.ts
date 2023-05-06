import { randomRange } from './random-range';

type Min = number;
type Max = number;
type TestData = [Min, Max];

describe('random-range', () => {
  (
    [
      [0, 0],
      [1, 1],
      ...new Array(5).fill(0).map(() => [0, 8]),
      ...new Array(5).fill(0).map(() => [2, 8]),
    ] as TestData[]
  ).forEach(([min, max]) => {
    it(`should return random number between ${min} and ${max}`, () => {
      const nbr = randomRange(min, max);
      expect(nbr).toBeGreaterThanOrEqual(min);
      expect(nbr).toBeLessThanOrEqual(max);
    });
  });
});
