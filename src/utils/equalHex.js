import hexToRgb from "./hexToRgb";
import equalColorObjects from "./equalColorObjects";

const equalHex = (first, second) => {
  if (first.toLowerCase() === second.toLowerCase()) return true;

  return equalColorObjects(hexToRgb(first), hexToRgb(second));
};

export default equalHex;
