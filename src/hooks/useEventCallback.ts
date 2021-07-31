import { useRef } from "react";

function noop() {}
// Saves incoming handler to the ref in order to avoid "useCallback hell"
function useEventCallback<T>(handler?: (value: T) => void): (value: T) => void {
  const callbackRef = useRef(handler);

  if (callbackRef.current !== handler) {
    callbackRef.current = handler;
  }

  return callbackRef.current || noop;
}

export { useEventCallback };
