import hslToHsv from "./hslToHsv";

const matcher = /hsl\((\d+(?:\.\d+)*),\s*(\d+(?:\.\d+)*)%?,\s*(\d+(?:\.\d+)*)%?\)/;

const hslStringToHsv = (string) => {
  const match = matcher.exec(string);

  return hslToHsv({
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
  });
};

export default hslStringToHsv;
