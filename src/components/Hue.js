import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Interactive from "./Interactive";
import { toHexString } from "../utils";
import styles from "../styles.css";

const Hue = ({ hue, onChange }) => {
  const handleMove = useCallback(
    (interaction) => {
      // Hue measured in degrees of the color circle ranging from 0 to 360
      onChange({ h: 360 * interaction.left });
    },
    [onChange]
  );

  const pointerStyle = {
    top: "50%",
    left: `${(hue / 360) * 100}%`,
    backgroundColor: toHexString({ h: hue, s: 1, l: 0.5 }),
  };

  return (
    <div className={styles.hue}>
      <Interactive onMove={handleMove}>
        <div className={styles.pointer} style={pointerStyle} />
      </Interactive>
    </div>
  );
};

Hue.propTypes = {
  hue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(Hue);
