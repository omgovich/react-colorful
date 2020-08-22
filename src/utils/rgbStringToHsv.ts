import rgbToHsv from "./rgbToHsv";

const matcher = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

const rgbStringToHsv = (string) => {
  const match = matcher.exec(string);

  return rgbToHsv({
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  });
};

export default rgbStringToHsv;
