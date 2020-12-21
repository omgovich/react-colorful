import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import styles from "../css/styles.css";

let sheet: HTMLStyleElement | null;

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (): void => {
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== "undefined" && !sheet) {
      sheet = document.head.appendChild(document.createElement("style"));
      sheet.innerHTML = styles;
    }
  }, []);
};
