import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HexColorPicker, HexColorInput, RgbaColor } from "../../src";
import { hexToRgba } from "../../src/utils/convert";
import { useFaviconColor } from "./hooks/useFaviconColor";
import { useBodyBackground } from "./hooks/useBodyBackground";
import styles from "./css/styles.css";

// See http://www.w3.org/TR/AERT#color-contrast
const getBrightness = ({ r, g, b }: RgbaColor) => (r * 299 + g * 587 + b * 114) / 1000;

const Demo = () => {
  const [color, setColor] = useState("#c92281");
  const textColor = getBrightness(hexToRgba(color)) < 128 ? "#FFF" : "#000";

  const handleChange = (color: string) => {
    console.log("🎨", color);
    setColor(color);
  };

  useBodyBackground(color);
  useFaviconColor(color);

  return (
    <div className={styles.wrapper} style={{ color: textColor }}>
      <header className={styles.header}>
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
            <a href="https://github.com/omgovich/react-colorful" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/react-colorful" target="_blank" rel="noreferrer">
              NPM
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));
