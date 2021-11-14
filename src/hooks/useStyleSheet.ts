import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { getNonce } from "../utils/nonce";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";
import { RefObject } from "react";

let styleElement: HTMLStyleElement | undefined;

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (containerRef?: RefObject<HTMLDivElement>): void => {
  useIsomorphicLayoutEffect(() => {
    const targetDocument =
      containerRef && containerRef.current ? containerRef.current.ownerDocument : document;
    if (typeof targetDocument !== "undefined" && !styleElement) {
      styleElement = targetDocument.createElement("style");
      styleElement.innerHTML = styles;

      // Conform to CSP rules by setting `nonce` attribute to the inline styles
      const nonce = getNonce();
      if (nonce) styleElement.setAttribute("nonce", nonce);

      targetDocument.head.appendChild(styleElement);
    }
  }, []);
};
