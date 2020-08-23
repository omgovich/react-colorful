const hex3 = /^#?[0-9A-F]{3}$/i;
const hex6 = /^#?[0-9A-F]{6}$/i;

export const validHex = (color: string): boolean => hex6.test(color) || hex3.test(color);
