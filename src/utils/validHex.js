const hex3 = /^#?[0-9A-F]{3}$/i;
const hex6 = /^#?[0-9A-F]{6}$/i;

const validHex = (color) => hex6.test(color) || hex3.test(color);

export default validHex;
