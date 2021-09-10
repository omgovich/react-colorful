import { hexMatcher, rgbStringMatcher } from "./convert";

export const validHex = (value: string, alpha?: boolean): boolean => {
  const match = hexMatcher.exec(value);
  const length = match ? match[1].length : 0;

  return (
    length === 3 || // '#rgb' format
    length === 6 || // '#rrggbb' format
    (!!alpha && length === 4) || // '#rgba' format
    (!!alpha && length === 8) // '#rrggbbaa' format
  );
};

export const validRgbString = (value: string): boolean => {
  return !!rgbStringMatcher.exec(value);
};
