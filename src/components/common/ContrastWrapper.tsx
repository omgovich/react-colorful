import React, { useState, useEffect } from "react";

import { hsvaToChromaColor, blendColors, getContrastCompliance } from "../../utils/contrast";
import { HsvaColor, ContrastInfo } from "../../types";
import chroma from "chroma-js";

interface ContrastWrapperProps {
  foregroundColor: HsvaColor;
  backgroundColor: HsvaColor;
  children: React.ReactNode;
  onContrastChange?: (contrastInfo: ContrastInfo) => void;
}

export const ContrastWrapper = ({
  children,
  foregroundColor,
  backgroundColor,
  onContrastChange,
}: ContrastWrapperProps): JSX.Element => {
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [pass, setPass] = useState<boolean>(false);

  useEffect(() => {
    const foregroundColorChroma = hsvaToChromaColor(foregroundColor);
    const backgroundColorChroma = hsvaToChromaColor(backgroundColor);

    const blendedForeground = blendColors(foregroundColorChroma, backgroundColorChroma);
    const ratio = chroma.contrast(blendedForeground, backgroundColorChroma);
    const { level, pass } = getContrastCompliance(ratio);

    setContrastRatio(ratio);
    setPass(pass);

    if (onContrastChange) {
      onContrastChange({
        ratio,
        level,
        pass,
      });
    }
  }, [foregroundColor, backgroundColor, onContrastChange]);

  return (
    <div className="contrast-color-picker">
      <div className="color-picker-container">{children}</div>

      <div className="contrast-analysis">
        <div className={`contrast-analysis-section ${pass ? "result-pass" : "result-fail"}`}>
          <span>Contrast Ratio</span>
          <p>{pass ? "Pass" : "Fail"}</p>
        </div>
      </div>
    </div>
  );
};
