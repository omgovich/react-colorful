import React, { useRef, useMemo } from "react";

import { useEventCallback } from "../../hooks/useEventCallback";
import { clamp } from "../../utils/clamp";
import { supportsPointerEvents } from "../../utils/supportsPointerEvents";
export interface Interaction {
  left: number;
  top: number;
}

// Check if an event was triggered by touch
const getPointer = (event: PointerEvent | TouchEvent): Touch | PointerEvent =>
  supportsPointerEvents ? (event as PointerEvent) : (event as TouchEvent).touches[0];

// Returns a relative position of the pointer inside the node's bounding box
const getRelativePosition = (
  node: HTMLDivElement,
  event: PointerEvent | TouchEvent
): Interaction => {
  const rect = node.getBoundingClientRect();

  const pointer = getPointer(event);

  return {
    left: clamp((pointer.pageX - (rect.left + window.pageXOffset)) / rect.width),
    top: clamp((pointer.pageY - (rect.top + window.pageYOffset)) / rect.height),
  };
};

interface Props {
  onMove: (interaction: Interaction) => void;
  onKey: (offset: Interaction) => void;
  children: React.ReactNode;
}

const InteractiveBase = ({ onMove, onKey, ...rest }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const onMoveCallback = useEventCallback<Interaction>(onMove);
  const onKeyCallback = useEventCallback<Interaction>(onKey);

  const [handleMoveStart, handleKeyDown] = useMemo(() => {
    const handleMoveStart = ({ nativeEvent }: React.PointerEvent | React.TouchEvent) => {
      const el = container.current;
      if (!el) {
        return;
      }

      // setPointerCapture is defined if and only if PointerEvent is supported
      el.setPointerCapture && el.setPointerCapture((nativeEvent as PointerEvent).pointerId);

      // The node/ref must actually exist when user start an interaction.
      // We won't suppress the ESLint warning though, as it should probably be something to be aware of.
      el.focus();
      onMoveCallback(getRelativePosition(el, nativeEvent));
      toggleDocumentEvents(true);
    };

    const handleMove = (event: PointerEvent | TouchEvent) => {
      // If user moves the pointer outside of the window or iframe bounds and release it there,
      // `mouseup`/`touchend` won't be fired. In order to stop the picker from following the cursor
      // after the user has moved the mouse/finger back to the document, we check `event.buttons`
      // and `event.touches`. It allows us to detect that the user is just moving his pointer
      // without pressing it down
      const isDown = !!getPointer(event);

      if (isDown && container.current) {
        onMoveCallback(getRelativePosition(container.current, event));
      } else {
        toggleDocumentEvents(false);
      }
    };

    const handleMoveEnd = () => toggleDocumentEvents(false);

    const handleKeyDown = (event: React.KeyboardEvent) => {
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
    };

    function toggleDocumentEvents(state: boolean) {
      // add or remove additional pointer event listeners
      const target = supportsPointerEvents ? container.current : window;
      if (!target) return;
      const toggleEvent = state ? target.addEventListener : target.removeEventListener;
      toggleEvent(supportsPointerEvents ? "pointermove" : "touchmove", handleMove);
      toggleEvent(supportsPointerEvents ? "pointerup" : "touchend", handleMoveEnd);
    }

    return [handleMoveStart, handleKeyDown];
  }, []);

  const handler = supportsPointerEvents
    ? {
        onPointerDown: handleMoveStart,
      }
    : {
        onTouchStart: handleMoveStart,
      };

  return (
    <div
      {...rest}
      {...handler}
      className="react-colorful__interactive"
      ref={container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
    />
  );
};

export const Interactive = React.memo(InteractiveBase);
