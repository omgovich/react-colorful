const hslToHsv = ({ h, s, l }) => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: ((2 * s) / (l + s)) * 100,
    v: l + s,
  };
};

export default hslToHsv;
