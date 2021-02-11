import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";

let styleElement: HTMLStyleElement | undefined;

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (): void => {
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== "undefined" && !styleElement) {
      styleElement = document.head.appendChild(document.createElement("style"));
      styleElement.innerHTML = styles;
    }
  }, []);
};
