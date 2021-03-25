import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { getNonce } from "../utils/nonce";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";

let styleElement: HTMLStyleElement | undefined;

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (): void => {
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== "undefined" && !styleElement) {
      styleElement = document.createElement("style");
      styleElement.innerHTML = styles;

      // Conform to CSP rules by setting `nonce` attribute to the inline styles
      const nonce = getNonce();
      if (nonce) styleElement.setAttribute("nonce", nonce);

      document.head.appendChild(styleElement);
    }
  }, []);
};
