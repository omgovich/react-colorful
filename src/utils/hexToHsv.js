const hexToRgb = (hex) => {
  if (hex[0] === "#") hex = hex.substr(1);

  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    };
  }

  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
  };
};

const rgbToHsv = ({ r, g, b }) => {
  let h, s, v;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  s = Math.round((max === 0 ? 0 : delta / max) * 100);

  v = Math.round((max / 255) * 100);

  return { h, s, v };
};

const hexToHsv = (hex) => rgbToHsv(hexToRgb(hex));

export default hexToHsv;
