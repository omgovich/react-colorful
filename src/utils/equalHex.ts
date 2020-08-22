import hexToRgb from "./hexToRgb";
import equalColorObjects from "./equalColorObjects";

const equalHex = (first: string, second: string): boolean => {
  if (first.toLowerCase() === second.toLowerCase()) return true;

  return equalColorObjects(hexToRgb(first), hexToRgb(second));
};

export default equalHex;
