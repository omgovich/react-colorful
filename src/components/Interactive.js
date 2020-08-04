import React, { useState, useEffect, useRef, useCallback } from "react";
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
      // add or remove additional pointer event listeners
      const toggleEvent = state ? document.addEventListener : document.removeEventListener;
      toggleEvent("mousemove", handleMove);
      toggleEvent("touchmove", handleMove);
      toggleEvent("mouseup", handleMoveEnd);
      toggleEvent("touchend", handleMoveEnd);
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

export default React.memo(Interactive);
