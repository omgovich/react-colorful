import { useRef, useEffect, useCallback } from "react";

// Saves incoming handler to the ref in order to avoid "useCallback hell"
function useEventCallback<T>(handler?: (value: T) => void): (value: T) => void {
  const callbackRef = useRef(handler);

  useEffect(() => {
    callbackRef.current = handler;
  });

  return useCallback((value: T) => callbackRef.current && callbackRef.current(value), []);
}

export { useEventCallback };
