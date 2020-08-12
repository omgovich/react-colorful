const hsvToHsl = ({ h, s, v }) => {
  const hh = ((200 - s) * v) / 100;

  return {
    h: h,
    s: (s * v) / (hh < 100 ? hh : 200 - hh),
    l: hh / 2,
  };
};

export default hsvToHsl;
