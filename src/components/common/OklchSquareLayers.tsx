import React from "react";

import { OklchGamut } from "../../types";
import { layerMask, squareLayers } from "../../utils/oklchGradients";

interface Props {
  hue: number;
  gamut: OklchGamut;
}

// Covers the whole square. Inline rather than in `styles.css`: that file ships with every
// picker, and only the OKLCH ones need this
const cover: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: "inherit",
  pointerEvents: "none",
};

/**
 * What the OKLCH square shows at a hue. A browser can only draw a gradient along one line, and
 * the square changes along both, so it is a stack of vertical gradients, one per chroma share,
 * each fading in by a horizontal mask where the previous one ends (see `squareLayers`).
 * On top goes the square's own thin inset outline, which the layers would otherwise hide.
 */
export const OklchSquareLayers = ({ hue, gamut }: Props): React.ReactElement => {
  const layers = squareLayers(hue, gamut).map((background, i) => {
    const mask = layerMask(i);
    const style = { ...cover, background, maskImage: mask, WebkitMaskImage: mask };
    return <div key={i} style={style} />;
  });

  return (
    <React.Fragment>
      {layers}
      <div style={{ ...cover, boxShadow: "inherit" }} />
    </React.Fragment>
  );
};
