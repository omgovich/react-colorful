const hsvToRgb = ({ h, s, v }) => {
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  let i = Math.floor(h),
    f = h - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    mod = i % 6,
    r = Math.round([v, q, p, p, t, v][mod] * 255),
    g = Math.round([t, v, v, q, p, p][mod] * 255),
    b = Math.round([p, p, t, v, v, q][mod] * 255);

  return { r, g, b };
};

export default hsvToRgb;
