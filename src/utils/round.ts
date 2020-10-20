export const round = (number: number, digits = 0): number => {
  // We wrap `toFixed` call with `Number()` to remove insignificant trailing zeros
  // because `(1).toFixed(2) // 1.00`
  return Number(number.toFixed(digits));
};
