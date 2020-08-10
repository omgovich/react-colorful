import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../styles.css";

const limit = (number) => Math.min(Math.max(0, number), 1);

const Interactive = ({ children, onMove }) => {
  const container = useRef();
  const [isDragging, setDragging] = useState(false);

  const getRelativePosition = useCallback((event) => {
    const rect = container.current.getBoundingClientRect();
    const pointer = typeof event.pageX === "number" ? event : event.touches[0];

    return {
      left: limit((pointer.pageX - (rect.left + window.pageXOffset)) / rect.width),
      top: limit((pointer.pageY - (rect.top + window.pageYOffset)) / rect.height),
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
