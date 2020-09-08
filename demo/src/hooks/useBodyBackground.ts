import { useEffect } from "react";

export const useBodyBackground = (color: string): void => {
  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);
};
