import { AnyColor, ColorModel, OklchaColor, OklchGamut, OklchState } from "../../types";
import { oklchaToState, stateToOklcha } from "../../utils/oklch";

/**
 * The color model of an OKLCH picker for a gamut. Kept in `models`, so that the picker gets the
 * same model object on every render. Pickers call it while rendering, not at the top level of
 * their modules: a top-level call would stay in the bundle of every other picker
 */
export const oklchModel = <T extends AnyColor>(
  models: Partial<Record<OklchGamut, ColorModel<T, OklchState>>>,
  gamut: OklchGamut,
  defaultColor: T,
  toOklcha: (color: T) => OklchaColor,
  fromOklcha: (color: OklchaColor) => T,
  equal: (first: T, second: T) => boolean
): ColorModel<T, OklchState> =>
  models[gamut] ||
  (models[gamut] = {
    defaultColor,
    toInternal: (color) => oklchaToState(toOklcha(color), gamut),
    fromInternal: (state) => fromOklcha(stateToOklcha(state, gamut)),
    equal,
  });
