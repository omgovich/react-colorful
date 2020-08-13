import hsvToHsl from "./hsvToHsl";

const hsvToHslString = (hsv) => {
  const { h, s, l } = hsvToHsl(hsv);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default hsvToHslString;
