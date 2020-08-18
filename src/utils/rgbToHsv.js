const rgbToHsv = ({ r, g, b }) => {
  let max = Math.max(r, g, b);
  let delta = max - Math.min(r, g, b);

  let hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
      ? 2 + (b - r) / delta
      : 4 + (r - g) / delta
    : 0;

  return {
    h: Math.round(60 * (hh < 0 ? hh + 6 : hh)),
    s: Math.round(max ? (delta / max) * 100 : 0),
    v: Math.round((max / 255) * 100),
  };
};

export default rgbToHsv;
