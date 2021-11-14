import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { getNonce } from "../utils/nonce";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";
import { RefObject } from "react";

const styleElementMap: Map<Document, HTMLStyleElement> = new Map();

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (containerRef?: RefObject<HTMLDivElement>): void => {
  useIsomorphicLayoutEffect(() => {
    const containerDocument =
      containerRef && containerRef.current ? containerRef.current.ownerDocument : document;
    if (typeof containerDocument !== "undefined" && !styleElementMap.has(containerDocument)) {
      const styleElement = containerDocument.createElement("style");
      styleElement.innerHTML = styles;
      styleElementMap.set(containerDocument, styleElement);

      // Conform to CSP rules by setting `nonce` attribute to the inline styles
      const nonce = getNonce();
      if (nonce) styleElement.setAttribute("nonce", nonce);

      containerDocument.head.appendChild(styleElement);
    }
  }, []);
};
