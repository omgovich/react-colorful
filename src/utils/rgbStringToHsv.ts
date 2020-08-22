import rgbToHsv from "./rgbToHsv";
import { HSV } from "../types";

const matcher = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

const rgbStringToHsv = (string: string): HSV => {
  const match = matcher.exec(string);

  return rgbToHsv({
    r: Number(match ? match : [1]),
    g: Number(match ? match : [2]),
    b: Number(match ? match : [3]),
  });
};

export default rgbStringToHsv;
