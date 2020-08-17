import hsvToRgb from "./hsvToRgb";

const hsvToRgbString = (hsv) => {
  const { r, g, b } = hsvToRgb(hsv);
  return `rgb(${r}, ${g}, ${b})`;
};

export default hsvToRgbString;
