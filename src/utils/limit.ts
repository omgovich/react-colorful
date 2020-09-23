// Limit number within bounds.
// Used ternary operator instead of `Math.min(Math.max(min, number), max)` to save few bytes
export const limit = (number: number, min = 0, max = 1): number => {
  return number > max ? max : number < min ? min : number;
};
