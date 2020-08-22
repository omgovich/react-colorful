import hslToHsv from "./hslToHsv";
import { HSV } from "../types";

const matcher = /hsl\((\d+(?:\.\d+)*),\s*(\d+(?:\.\d+)*)%?,\s*(\d+(?:\.\d+)*)%?\)/;

const hslStringToHsv = (hslString: string): HSV => {
  const match = matcher.exec(hslString);

  return hslToHsv({
    h: Number(match ? match : [1]),
    s: Number(match ? match : [2]),
    l: Number(match ? match : [3]),
  });
};

export default hslStringToHsv;
