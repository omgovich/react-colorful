import React, { useState, useLayoutEffect, useRef, useCallback } from "react";

import { limit } from "../../utils/limit";

import styles from "../../css/styles.css";

// Check if an event was triggered by touch
const isTouch = (e: MouseEvent | TouchEvent) => window.TouchEvent && e instanceof TouchEvent;

// Arrow key codes: ←37, ↑38, →39, ↓40
const getOffset = (keyCode: number) => ({
  left: keyCode === 39 ? 0.05 : keyCode === 37 ? -0.05 : 0,
  top: keyCode === 40 ? 0.05 : keyCode === 38 ? -0.05 : 0,
});

export interface Interaction {
  left: number;
  top: number;
}

interface Props {
  onMove: (interaction: Interaction) => void;
  onKey: (offset: Interaction) => void;
  children: React.ReactNode;
}

const InteractiveBase = ({ onMove, onKey, children, ...rest }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const hasTouched = useRef(false);
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

  // Prevent mobile browsers from handling mouse events (conflicting with touch ones).
  // If we detected a touch interaction before, we prefer reacting to touch events only.
  const isValid = (event: MouseEvent | TouchEvent): boolean => {
    if (hasTouched.current && !isTouch(event)) return false;
    if (!hasTouched.current) hasTouched.current = isTouch(event);
    return true;
  };

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Ignore all keys except arrow ones
      if (event.which < 37 || event.which > 40) return;
      // Do not scroll page by arrow keys when document is focused on the element
      event.preventDefault();
      // Send relative offset to the parent component
      onKey(getOffset(event.which));
    },
    [onKey]
  );

  const handleMoveEnd = useCallback(() => setDragging(false), []);

  const toggleDocumentEvents = useCallback(
    (state) => {
      // add or remove additional pointer event listeners
      const toggleEvent = state ? window.addEventListener : window.removeEventListener;
      toggleEvent(hasTouched.current ? "touchmove" : "mousemove", handleMove);
      toggleEvent(hasTouched.current ? "touchend" : "mouseup", handleMoveEnd);
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
      {...rest}
      className={styles.interactive}
      ref={container}
      onTouchStart={handleMoveStart}
      onMouseDown={handleMoveStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
    >
      {children}
    </div>
  );
};

export const Interactive = React.memo(InteractiveBase);
