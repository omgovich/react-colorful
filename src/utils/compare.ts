import { hexToRgb } from "./convert";

export const equalColorObjects = (
  first: Record<string, unknown>,
  second: Record<string, unknown>
): boolean => {
  if (first === second) return true;

  for (const prop in first) {
    if (first[prop] !== second[prop]) return false;
  }

  return true;
};

export const equalHex = (first: string, second: string): boolean => {
  if (first.toLowerCase() === second.toLowerCase()) return true;

  return equalColorObjects(hexToRgb(first), hexToRgb(second));
};
