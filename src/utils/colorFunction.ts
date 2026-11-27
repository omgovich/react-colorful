// Reading CSS color functions such as `oklch()`

/** A component of a CSS color function: a number with an optional unit (`%`, `deg`, `turn`…) */
export interface ColorComponent {
  value: number;
  unit?: string;
}

/** Three components, and the alpha if the string has one */
export type ColorComponents = [ColorComponent, ColorComponent, ColorComponent, ColorComponent?];

// A number with one of `units`. The number may have a sign, a fraction and an exponent, or be
// `none` (a missing component, read as 0, and never with a unit). Its digits are
// `(?:\d+\.|\.)?\d+` and not `\d*\.?\d+`: both take the same strings, but the second one tries
// every split of a long run of digits and turns quadratic
const component = (units: string) =>
  `(none(?![%a-z])|[-+]?(?:\\d+\\.|\\.)?\\d+(?:e[-+]?\\d+)?)(${units})?`;

/**
 * Reads the components of `name(x y z)` or `name(x y z / alpha)` found in a string, like the
 * parsers of the other pickers do. `units` are the units each of x, y and z may have (as regex
 * alternatives: `"deg|rad"`); the alpha may be a percentage. Returns null if there is none
 */
export const parseColorFunction = (
  name: string,
  value: string,
  units: [string, string, string]
): ColorComponents | null => {
  const [x, y, z] = units.map(component);
  const alpha = `(?:/\\s*${component("%")}\\s*)?`;
  const match = new RegExp(`${name}\\(\\s*${x}\\s+${y}\\s+${z}\\s*${alpha}\\)`, "i").exec(value);
  if (!match) return null;

  // Each component is two groups: the number, then the unit
  const read = (i: number): ColorComponent => ({
    value: Number(match[i]) || 0,
    unit: match[i + 1],
  });

  const components: ColorComponents = [read(1), read(3), read(5)];
  if (match[7] !== undefined) components.push(read(7));
  return components;
};

/** A component's value, where a percentage is a share of `hundredPercent`: 50% of 0.4 is 0.2 */
export const percentOf = ({ value, unit }: ColorComponent, hundredPercent = 1): number =>
  unit === "%" ? (value * hundredPercent) / 100 : value;
