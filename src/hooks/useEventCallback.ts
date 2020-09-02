import { useRef, useEffect, useCallback } from "react";

function useEventCallback<T>(event?: (arg: T) => void): (arg: T) => void {
  const eventRef = useRef(event);

  useEffect(() => {
    eventRef.current = event;
  });

  return useCallback((arg: T) => eventRef.current && eventRef.current(arg), []);
}

export { useEventCallback };
