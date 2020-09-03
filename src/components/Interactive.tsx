import React, { useState, useLayoutEffect, useRef, useCallback } from "react";

import styles from "../styles.module.css";

// Limit number within [0, 1] bounds.
// Use ternary operator instead of `Math.min(Math.max(0, number), 1)` to save few bytes
const limit = (number: number) => (number > 1 ? 1 : number < 0 ? 0 : number);

export interface Interaction {
  left: number;
  top: number;
}

interface Props {
  onMove: (interaction: Interaction) => void;
  children: React.ReactNode;
}

const Interactive = ({ onMove, children }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);

  const getRelativePosition = useCallback((event) => {
    // This should be okay. This is only called onMove, and for it to be moved it must actually exist.
    // I won't suppress the ESLint warning though, as it should probably be something to be aware of.
    const rect = container.current!.getBoundingClientRect();
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

  useLayoutEffect(() => {
    toggleDocumentEvents(isDragging);
    return () => {
      isDragging && toggleDocumentEvents(false);
    };
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
