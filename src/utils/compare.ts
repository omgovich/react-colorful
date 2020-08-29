import { hexToRgb } from "./convert";

import { HSL, HSV, RGB } from "../types";

interface ColorCompare {
  [key: string]: number;
}

export const equalColorObjects = (first: HSL | HSV | RGB, second: HSL | HSV | RGB): boolean => {
  if (first === second) return true;

  for (const prop in first) {
    if (((first as unknown) as ColorCompare)[prop] !== ((second as unknown) as ColorCompare)[prop])
      return false;
  }

  return true;
};

export const equalColorString = (first: string, second: string): boolean => {
  return first.replace(/\s/g, "") === second.replace(/\s/g, "");
};

export const equalHex = (first: string, second: string): boolean => {
  if (first.toLowerCase() === second.toLowerCase()) return true;

  return equalColorObjects(hexToRgb(first), hexToRgb(second));
};
