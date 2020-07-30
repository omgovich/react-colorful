import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
// import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import { limit } from "../utils";
import styles from "../styles.css";

const Interactive = ({ children, onMove }) => {
  const container = useRef();
  const [isDragging, setDragging] = useState(false);

  const getRelativePosition = useCallback((event) => {
    const element = container.current;
    const dimensions = element.getBoundingClientRect();
    const left = typeof event.pageX === "number" ? event.pageX : event.touches[0].pageX;
    const top = typeof event.pageY === "number" ? event.pageY : event.touches[0].pageY;

    return {
      left: limit((left - (dimensions.left + window.pageXOffset)) / dimensions.width),
      top: limit((top - (dimensions.top + window.pageYOffset)) / dimensions.height),
    };
  }, []);

  const handleMove = useCallback(
    (event) => {
      event.preventDefault();
      if (container.current) onMove(getRelativePosition(event));
    },
    [onMove, getRelativePosition]
  );

  const handleMoveStart = useCallback(
    (event) => {
      onMove(getRelativePosition(event));
      setDragging(true);
    },
    [onMove, getRelativePosition]
  );

  const handleMoveEnd = useCallback(() => setDragging(false), []);

  const toggleDocumentEvents = useCallback(
    (state) => {
      const toggleEvent = state ? window.addEventListener : window.removeEventListener;
      // const toggleScroll = state ? disableBodyScroll : enableBodyScroll;

      // add or remove additional pointer event listeners
      toggleEvent("mousemove", handleMove);
      toggleEvent("touchmove", handleMove);
      toggleEvent("mouseup", handleMoveEnd);
      toggleEvent("touchend", handleMoveEnd);

      // prevent window scrolling during dragging (for mobile devices mostly)
      // toggleScroll(container.current);
    },
    [handleMove, handleMoveEnd]
  );

  useEffect(() => {
    toggleDocumentEvents(isDragging);
    return () => isDragging && toggleDocumentEvents(false);
  }, [isDragging, toggleDocumentEvents]);

  return (
    <div
      className={styles.interactive}
      ref={container}
      onTouchStart={handleMoveStart}
      onMouseDown={handleMoveStart}
    >
      {children}
    </div>
  );
};

Interactive.propTypes = {
  children: PropTypes.any,
  onMove: PropTypes.func.isRequired,
};

export default React.memo(Interactive);
