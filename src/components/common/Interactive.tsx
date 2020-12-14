import React, { useState, useRef, useCallback, PointerEvent } from "react";

import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useEventCallback } from "../../hooks/useEventCallback";
import { clamp } from "../../utils/clamp";

export interface Interaction {
  left: number;
  top: number;
}

// Fix conflicting `PointerEvent` types from React and TS
type NativePointerEvent = WindowEventMap["pointermove"];

// Returns a relative position of the pointer inside the node's bounding box
const getRelativePosition = (node: HTMLDivElement, event: NativePointerEvent): Interaction => {
  const rect = node.getBoundingClientRect();

  return {
    left: clamp((event.pageX - (rect.left + window.pageXOffset)) / rect.width),
    top: clamp((event.pageY - (rect.top + window.pageYOffset)) / rect.height),
  };
};

interface Props {
  onMove: (interaction: Interaction) => void;
  onKey: (offset: Interaction) => void;
  children: React.ReactNode;
}

const InteractiveBase = ({ onMove, onKey, ...rest }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const onMoveCallback = useEventCallback<Interaction>(onMove);
  const onKeyCallback = useEventCallback<Interaction>(onKey);

  const handleMove = useCallback(
    (event: NativePointerEvent) => {
      event.preventDefault();
      if (container.current) onMoveCallback(getRelativePosition(container.current, event));
    },
    [onMoveCallback]
  );

  const handleMoveStart = useCallback(
    ({ nativeEvent: event }: React.PointerEvent) => {
      event.preventDefault();

      // The node/ref must actually exist when user start an interaction.
      // We won't suppress the ESLint warning though, as it should probably be something to be aware of.
      onMoveCallback(getRelativePosition(container.current!, event));
      setDragging(true);
    },
    [onMoveCallback]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const keyCode = event.which || event.keyCode;

      // Ignore all keys except arrow ones
      if (keyCode < 37 || keyCode > 40) return;
      // Do not scroll page by arrow keys when document is focused on the element
      event.preventDefault();
      // Send relative offset to the parent component.
      // We use codes (37←, 38↑, 39→, 40↓) instead of keys ('ArrowRight', 'ArrowDown', etc)
      // to reduce the size of the library
      onKeyCallback({
        left: keyCode === 39 ? 0.05 : keyCode === 37 ? -0.05 : 0,
        top: keyCode === 40 ? 0.05 : keyCode === 38 ? -0.05 : 0,
      });
    },
    [onKeyCallback]
  );

  const handleMoveEnd = useCallback(() => setDragging(false), []);

  const toggleDocumentEvents = useCallback(
    (state) => {
      // add or remove additional pointer event listeners
      const toggleEvent = state ? window.addEventListener : window.removeEventListener;

      if (container.current) {
        container.current.setPointerCapture(e.pointerId);
      }

      toggleEvent("pointermove", handleMove);
      toggleEvent("pointerup", handleMoveEnd);
    },
    [handleMove, handleMoveEnd]
  );

  useIsomorphicLayoutEffect(() => {
    toggleDocumentEvents(isDragging);
    return () => {
      isDragging && toggleDocumentEvents(false);
    };
  }, [isDragging, toggleDocumentEvents]);

  return (
    <div
      {...rest}
      className="react-colorful__interactive"
      ref={container}
      onPointerDown={handleMoveStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
    />
  );
};

export const Interactive = React.memo(InteractiveBase);
