import React from "react";
import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";
import { HsvaColor } from "../../types";
import { hsvaToHslString } from "../../utils/convert";
import { calculateComplianceLinePath, generateNonCompliantDots } from "../../utils/contrast";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  hsva: HsvaColor;
  backgroundHsva?: HsvaColor;
  onChange: (newColor: { s: number; v: number }) => void;
}

const SaturationBase = ({ hsva, backgroundHsva, onChange }: Props) => {
  const handleMove = (interaction: Interaction) => {
    onChange({
      s: interaction.left * 100,
      v: 100 - interaction.top * 100,
    });
  };

  const handleKey = (offset: Interaction) => {
    // Saturation and brightness always fit into [0, 100] range
    onChange({
      s: clamp(hsva.s + offset.left * 100, 0, 100),
      v: clamp(hsva.v - offset.top * 100, 0, 100),
    });
  };

  const complianceResult = calculateComplianceLinePath(hsva, backgroundHsva);
  const nonCompliantDots = generateNonCompliantDots(hsva, backgroundHsva);

  const containerStyle = {
    backgroundColor: hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 }),
  };

  return (
    <div className="react-colorful__saturation" style={containerStyle}>
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        aria-label="Color"
        aria-valuetext={`Saturation ${round(hsva.s)}%, Brightness ${round(hsva.v)}%`}
      >
        {/* Non-compliant area dots (CSS-based for perfect circles) */}
        {nonCompliantDots && (
          <div
            className="react-colorful__compliance-dots"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
              opacity: 0.6,
            }}
          >
            {nonCompliantDots}
          </div>
        )}

        {/* Compliance line (SVG for smooth curves) */}
        {complianceResult.path && (
          <svg
            className="react-colorful__compliance-line"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 2,
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={complianceResult.path}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="0.8"
              fill="none"
              filter="drop-shadow(0 0 1px rgba(0, 0, 0, 0.8))"
            >
              <title>AA Compliance Line - Colors below this line meet WCAG AA standards</title>
            </path>
          </svg>
        )}
        <Pointer
          className="react-colorful__saturation-pointer"
          top={1 - hsva.v / 100}
          left={hsva.s / 100}
          color={hsvaToHslString(hsva)}
        />
      </Interactive>
    </div>
  );
};

export const Saturation = React.memo(SaturationBase);
