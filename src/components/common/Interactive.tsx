import React, { useRef, useMemo } from "react";

import { useEventCallback } from "../../hooks/useEventCallback";
import { clamp } from "../../utils/clamp";
export interface Interaction {
  left: number;
  top: number;
}

// Check if an event was triggered by touch
const isTouch = (event: MouseEvent | TouchEvent): event is TouchEvent => "touches" in event;

// Returns a relative position of the pointer inside the node's bounding box
const getRelativePosition = (node: HTMLDivElement, event: MouseEvent | TouchEvent): Interaction => {
  const rect = node.getBoundingClientRect();

  // Get user's pointer position from `touches` array if it's a `TouchEvent`
  const pointer = isTouch(event) ? event.touches[0] : (event as MouseEvent);

  return {
    left: clamp((pointer.pageX - (rect.left + window.pageXOffset)) / rect.width),
    top: clamp((pointer.pageY - (rect.top + window.pageYOffset)) / rect.height),
  };
};

// Browsers introduced an intervention, making touch events passive by default.
// This workaround removes `preventDefault` call from the touch handlers.
// https://github.com/facebook/react/issues/19651
const preventDefaultMove = (event: MouseEvent | TouchEvent): void => {
  !isTouch(event) && event.preventDefault();
};

// Prevent mobile browsers from handling mouse events (conflicting with touch ones).
// If we detected a touch interaction before, we prefer reacting to touch events only.
const isInvalid = (event: MouseEvent | TouchEvent, hasTouch: boolean): boolean =>
  hasTouch && !isTouch(event);

interface Props {
  onMove: (interaction: Interaction) => void;
  onKey: (offset: Interaction) => void;
  children: React.ReactNode;
}

const InteractiveBase = ({ onMove, onKey, ...rest }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const onMoveCallback = useEventCallback<Interaction>(onMove);
  const onKeyCallback = useEventCallback<Interaction>(onKey);
  const hasTouch = useRef(false);

  const [handleMoveStart, handleKeyDown] = useMemo(() => {
    const handleMoveStart = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
      const el = container.current;
      if (!el) {
        return;
      }

      // Prevent text selection
      preventDefaultMove(nativeEvent);

      if (isInvalid(nativeEvent, hasTouch.current) || !el) return;
      hasTouch.current = isTouch(nativeEvent);

      // The node/ref must actually exist when user start an interaction.
      // We won't suppress the ESLint warning though, as it should probably be something to be aware of.
      el.focus();
      onMoveCallback(getRelativePosition(el, nativeEvent));
      toggleDocumentEvents(true);
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      // Prevent text selection
      preventDefaultMove(event);

      // If user moves the pointer outside of the window or iframe bounds and release it there,
      // `mouseup`/`touchend` won't be fired. In order to stop the picker from following the cursor
      // after the user has moved the mouse/finger back to the document, we check `event.buttons`
      // and `event.touches`. It allows us to detect that the user is just moving his pointer
      // without pressing it down
      const isDown = isTouch(event) ? event.touches.length > 0 : event.buttons > 0;

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
      const touch = hasTouch.current;
      // add or remove additional pointer event listeners
      const toggleEvent = state ? self.addEventListener : self.removeEventListener;
      toggleEvent(touch ? "touchmove" : "mousemove", handleMove);
      toggleEvent(touch ? "touchend" : "mouseup", handleMoveEnd);
    }

    return [handleMoveStart, handleKeyDown];
  }, []);

  return (
    <div
      {...rest}
      onTouchStart={handleMoveStart}
      onMouseDown={handleMoveStart}
      className="react-colorful__interactive"
      ref={container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
    />
  );
};

export const Interactive = React.memo(InteractiveBase);
