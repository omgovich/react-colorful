import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import ColorPicker from "../../src";
import hexToRgb from "../../src/utils/hexToRgb";
import styles from "./styles.css";

// See http://www.w3.org/TR/AERT#color-contrast
const getBrightness = ({ r, g, b }) => (r * 299 + g * 587 + b * 114) / 1000;

const Demo = () => {
  const [color, setColor] = useState("#c92281");
  const textColor = getBrightness(hexToRgb(color)) < 128 ? "#FFF" : "#000";

  const handleChange = useCallback((color) => {
    console.log("🎨", color);
    setColor(color);
  }, []);

  return (
    <div className={styles.wrapper} style={{ color: textColor, backgroundColor: color }}>
      <header className={styles.header}>
        <ColorPicker className={styles.colorPicker} color={color} onChange={handleChange} />
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
