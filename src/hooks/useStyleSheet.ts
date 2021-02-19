import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";

const styleId = '__react-colorful';
let styleElement: HTMLStyleElement | undefined;

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (): void => {
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== "undefined" && !styleElement) {
      if (document.getElementById(styleId)) {
        styleElement = document.getElementById(styleId) as HTMLStyleElement;
        return;
      }
      styleElement = document.head.appendChild(document.createElement("style"));
      styleElement.id = styleId;
      styleElement.innerHTML = styles;
    }
  }, []);
};

/**
 * Allows CSS string to be accessible to the end user, for cases like SSR
 */
export const getStyleSheet = (): string => `<style id="${styleId}">${styles}</style>`;
