import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import styles from "../../css/styles.css";

let hasTouched = false;

// Limit number within [0, 1] bounds.
// Use ternary operator instead of `Math.min(Math.max(0, number), 1)` to save few bytes
const limit = (number: number) => (number > 1 ? 1 : number < 0 ? 0 : number);

// Check if an event was triggered by touch
const isTouch = (e: MouseEvent | TouchEvent) => window.TouchEvent && e instanceof TouchEvent;

// Prevent mobile browsers from handling mouse events (conflicting with touch ones).
// If we detected a touch interaction before, we prefer reacting to touch events only.
const isValid = (event: MouseEvent | TouchEvent): boolean => {
  if (hasTouched && !isTouch(event)) return false;
  if (!hasTouched) hasTouched = isTouch(event);
  return true;
};

export interface Interaction {
  left: number;
  top: number;
}

interface Props {
  onMove: (interaction: Interaction) => void;
  children: React.ReactNode;
}

const InteractiveBase = ({ onMove, children }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);

  const getRelativePosition = useCallback((event: MouseEvent | TouchEvent) => {
    // This method is only called `onMove`, and for it to be moved it must actually exist.
    // We won't suppress the ESLint warning though, as it should probably be something to be aware of.
    const rect = container.current!.getBoundingClientRect();

    // Get user's pointer position from `touches` array if it's a `TouchEvent`
    const pointer = isTouch(event) ? (event as TouchEvent).touches[0] : (event as MouseEvent);

    return {
      left: limit((pointer.pageX - (rect.left + window.pageXOffset)) / rect.width),
      top: limit((pointer.pageY - (rect.top + window.pageYOffset)) / rect.height),
    };
  }, []);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (container.current) onMove(getRelativePosition(event));
    },
    [onMove, getRelativePosition]
  );

  const handleMoveStart = useCallback(
    ({ nativeEvent: event }: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault();

      if (!isValid(event)) return;

      onMove(getRelativePosition(event));
      setDragging(true);
    },
    [onMove, getRelativePosition]
  );

  const handleMoveEnd = useCallback(() => setDragging(false), []);

  const toggleDocumentEvents = useCallback(
    (state) => {
      // add or remove additional pointer event listeners
      const toggleEvent = state ? window.addEventListener : window.removeEventListener;
      toggleEvent(hasTouched ? "touchmove" : "mousemove", handleMove);
      toggleEvent(hasTouched ? "touchend" : "mouseup", handleMoveEnd);
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

export const Interactive = React.memo(InteractiveBase);
