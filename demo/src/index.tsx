import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  // HEX
  HexColorPicker,
  HexColorInput,
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
} from "../../src";
import { PickerPreview } from "./components/PickerPreview";
import { Star } from "./components/Icon";
import { hexToRgba } from "../../src/utils/convert";
import { useFaviconColor } from "./hooks/useFaviconColor";
import { useBodyBackground } from "./hooks/useBodyBackground";
import { useStargazerCount } from "./hooks/useStargazerCount";
import styles from "./css/styles.css";

// See http://www.w3.org/TR/AERT#color-contrast
const getBrightness = ({ r, g, b }: RgbaColor) => (r * 299 + g * 587 + b * 114) / 1000;

const Demo = () => {
  const [color, setColor] = useState("#c92281");
  const textColor = getBrightness(hexToRgba(color)) < 128 ? "#FFF" : "#000";

  const stargazerCount = useStargazerCount();

  const handleChange = (color: string) => {
    console.log("🎨", color);
    setColor(color);
  };

  useBodyBackground(color);
  useFaviconColor(color);

  return (
    <div>
      <header className={styles.header} style={{ color: textColor }}>
        <div className={styles.demo}>
          <HexColorPicker className={styles.colorPicker} color={color} onChange={handleChange} />
          <div className={styles.field}>
            <HexColorInput className={styles.hexInput} color={color} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>React Colorful 🎨</h1>
          <h2 className={styles.headerDescription}>
            A tiny color picker component for modern React apps
          </h2>
          <nav className={styles.links}>
            <a
              className={styles.link}
              href="https://github.com/omgovich/react-colorful"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <span className={styles.linkSeparator} />
              <Star className={styles.linkIcon} />
              {stargazerCount}
            </a>
            <a
              className={styles.link}
              href="https://www.npmjs.com/package/react-colorful"
              target="_blank"
              rel="noreferrer"
            >
              NPM
            </a>
          </nav>
        </div>
      </header>

      {process.env.NODE_ENV === "development" && (
        <div>
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
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));
