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
} from "../../../src";

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

      <PickerPreview<RgbColor>
        frame
        title="RGB"
        PickerComponent={RgbColorPicker}
        initialColor={{ r: 60, g: 80, b: 120 }}
      />
    </div>
  );
};
