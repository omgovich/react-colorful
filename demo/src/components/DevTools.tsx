import React from "react";
import { PickerPreview } from "./PickerPreview";
import {
  // HEX
  HexColorPicker,
  HexAlphaColorPicker,
  // RGB
  RgbColor,
  RgbColorPicker,
  RgbStringColorPicker,
  // RGBA
  RgbaColor,
  RgbaColorPicker,
  RgbaStringColorPicker,
  // HSL
  HslColor,
  HslColorPicker,
  HslStringColorPicker,
  // HSLA
  HslaColor,
  HslaColorPicker,
  HslaStringColorPicker,
  // HSV
  HsvColor,
  HsvColorPicker,
  HsvStringColorPicker,
  // HSVA
  HsvaColor,
  HsvaColorPicker,
  HsvaStringColorPicker,
  // OKLCH
  OklchColor,
  OklchColorPicker,
  OklchStringColorPicker,
  OklchaColor,
  OklchaColorPicker,
  OklchaStringColorPicker,
  // OKLab
  OklabColor,
  OklabColorPicker,
  OklabaStringColorPicker,
} from "../../../src";

// The same color in an sRGB and a P3 picker, side by side: on a P3 screen the right edge of
// the P3 square is visibly more vivid (greens most of all)
const OklchGamutsColorPicker = (props: React.ComponentProps<typeof OklchStringColorPicker>) => (
  <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
    <div>
      <OklchStringColorPicker {...props} />
      sRGB
    </div>
    <div>
      <OklchStringColorPicker {...props} gamut="p3" />
      P3
    </div>
  </div>
);

export const DevTools = (): JSX.Element => {
  return (
    <div>
      <PickerPreview<string> title="HEX" PickerComponent={HexColorPicker} initialColor="#406090" />
      <PickerPreview<string>
        title="HEX Alpha"
        PickerComponent={HexAlphaColorPicker}
        initialColor="#40609088"
      />
      <PickerPreview<RgbColor>
        title="RGB"
        PickerComponent={RgbColorPicker}
        initialColor={{ r: 60, g: 80, b: 120 }}
      />
      <PickerPreview<string>
        title="RGB String"
        PickerComponent={RgbStringColorPicker}
        initialColor="rgb(60, 80, 120)"
      />
      <PickerPreview<RgbaColor>
        title="RGBA"
        PickerComponent={RgbaColorPicker}
        initialColor={{ r: 60, g: 80, b: 120, a: 0.5 }}
      />
      <PickerPreview<string>
        title="RGBA String"
        PickerComponent={RgbaStringColorPicker}
        initialColor="rgba(60, 80, 120, 0.5)"
      />
      <PickerPreview<HslColor>
        title="HSL"
        PickerComponent={HslColorPicker}
        initialColor={{ h: 200, s: 25, l: 32 }}
      />
      <PickerPreview<string>
        title="HSL String"
        PickerComponent={HslStringColorPicker}
        initialColor="hsl(200, 25%, 32%)"
      />
      <PickerPreview<HslaColor>
        title="HSLA"
        PickerComponent={HslaColorPicker}
        initialColor={{ h: 200, s: 25, l: 32, a: 0.5 }}
      />
      <PickerPreview<string>
        title="HSLA String"
        PickerComponent={HslaStringColorPicker}
        initialColor="hsl(200, 25%, 32%, 0.5)"
      />
      <PickerPreview<HsvColor>
        title="HSV"
        PickerComponent={HsvColorPicker}
        initialColor={{ h: 200, s: 25, v: 50 }}
      />
      <PickerPreview<string>
        title="HSV String"
        PickerComponent={HsvStringColorPicker}
        initialColor="hsv(200, 25%, 50%)"
      />
      <PickerPreview<HsvaColor>
        title="HSVA"
        PickerComponent={HsvaColorPicker}
        initialColor={{ h: 200, s: 25, v: 50, a: 0.5 }}
      />
      <PickerPreview<string>
        title="HSVA String"
        PickerComponent={HsvaStringColorPicker}
        initialColor="hsva(200, 25%, 50%, 0.5)"
      />

      <PickerPreview<OklchColor>
        title="OKLCH"
        PickerComponent={OklchColorPicker}
        initialColor={{ l: 0.6, c: 0.15, h: 250 }}
      />
      <PickerPreview<string>
        title="OKLCH String"
        PickerComponent={OklchStringColorPicker}
        initialColor="oklch(0.6 0.15 250)"
      />
      <PickerPreview<OklchaColor>
        title="OKLCHA"
        PickerComponent={OklchaColorPicker}
        initialColor={{ l: 0.6, c: 0.15, h: 250, a: 0.5 }}
      />
      <PickerPreview<string>
        title="OKLCHA String"
        PickerComponent={OklchaStringColorPicker}
        initialColor="oklch(0.6 0.15 250 / 0.5)"
      />
      <PickerPreview<OklabColor>
        title="OKLab"
        PickerComponent={OklabColorPicker}
        initialColor={{ l: 0.6, a: -0.05, b: -0.14 }}
      />
      <PickerPreview<string>
        title="OKLab String"
        PickerComponent={OklabaStringColorPicker}
        initialColor="oklab(0.6 -0.05 -0.14 / 0.5)"
      />
      <PickerPreview<string>
        title="OKLCH sRGB vs P3"
        PickerComponent={OklchGamutsColorPicker}
        initialColor="oklch(0.85 0.2 145)"
      />

      <PickerPreview<RgbColor>
        frame
        title="RGB"
        PickerComponent={RgbColorPicker}
        initialColor={{ r: 60, g: 80, b: 120 }}
      />

      <PickerPreview<RgbColor>
        shadow
        title="RGB (Shadow DOM)"
        PickerComponent={RgbColorPicker}
        initialColor={{ r: 60, g: 80, b: 120 }}
      />
    </div>
  );
};
