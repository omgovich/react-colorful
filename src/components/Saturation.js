import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Interactive from "./Interactive";
import { toHexString } from "../utils";
import styles from "../styles.css";

const Saturation = ({ hsv, onChange }) => {
  const handleMove = useCallback(
    (interaction) => {
      // Saturation and brightness always fit into [0, 1] range
      const saturation = interaction.left;
      const brightness = 1 - interaction.top;
      onChange({ s: saturation, v: brightness });
    },
    [onChange]
  );

  const containerStyle = {
    backgroundColor: toHexString({ h: hsv.h, s: 1, l: 0.5 }),
  };

  const pointerStyle = {
    top: `${100 - hsv.v * 100}%`,
    left: `${hsv.s * 100}%`,
    backgroundColor: toHexString(hsv),
  };

  return (
    <div className={styles.saturation} style={containerStyle}>
      <Interactive onMove={handleMove}>
        <div className={styles.pointer} style={pointerStyle} />
      </Interactive>
    </div>
  );
};

Saturation.propTypes = {
  hsv: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(Saturation);
