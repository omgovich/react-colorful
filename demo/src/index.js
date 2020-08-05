import React, { useState } from "react";
import ReactDOM from "react-dom";
import { isDark, hexToRgb } from "color-fns";
import ColorPicker from "../../src";
import styles from "./styles.css";

const Demo = () => {
  const [color, setColor] = useState("#c92281");
  const textColor = isDark(hexToRgb(color)) ? "#FFF" : "#000";

  return (
    <div className={styles.wrapper} style={{ color: textColor, backgroundColor: color }}>
      <header className={styles.header}>
        <ColorPicker className={styles.colorPicker} hex={color} onChange={setColor} />
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
