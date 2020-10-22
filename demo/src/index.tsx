import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  // HEX
  HexColorPicker,
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
import { useFaviconColor } from "./hooks/useFaviconColor";
import { useBodyBackground } from "./hooks/useBodyBackground";
import { useStargazerCount } from "./hooks/useStargazerCount";
import "./css/styles.css";

// See http://www.w3.org/TR/AERT#color-contrast
const getBrightness = ({ r, g, b }: RgbaColor) => (r * 299 + g * 587 + b * 114) / 1000;

const getRandomColor = (): RgbaColor => {
  const colors = [
    { r: 209, g: 97, b: 28, a: 1 }, // orange
    { r: 34, g: 91, b: 161, a: 1 }, // blue
    { r: 225, g: 17, b: 135, a: 0.7625 }, // purple
    { r: 21, g: 139, b: 59, a: 1 }, // green
    { r: 189, g: 60, b: 60, a: 1 }, // salmon
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

const Demo = () => {
  const [color, setColor] = useState<RgbaColor>(getRandomColor);
  const textColor = getBrightness(color) > 128 || color.a < 0.5 ? "#000" : "#FFF";

  const stargazerCount = useStargazerCount();

  const handleChange = (color: RgbaColor) => {
    console.log("🎨", color);
    setColor(color);
  };

  const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}`;

  useBodyBackground(colorString);
  useFaviconColor(colorString);

  return (
    <div>
      <header className="header" style={{ color: textColor }}>
        <div className="header__demo">
          <RgbaColorPicker className="header__picker" color={color} onChange={handleChange} />
        </div>
        <div className="header__content">
          <h1 className="header__title">React Colorful 🎨</h1>
          <h2 className="header__description">
            A tiny color picker component for modern React apps
          </h2>
          <nav className="links">
            <a
              className="link"
              href="https://github.com/omgovich/react-colorful"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <span className="link__separator" />
              <Star className="link__icon" />
              {stargazerCount}
            </a>
            <a
              className="link"
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
          <PickerPreview<string>
            title="HEX"
            PickerComponent={HexColorPicker}
            initialColor="#406090"
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
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));
