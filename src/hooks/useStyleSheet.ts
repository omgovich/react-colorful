import { RefObject } from "react";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { getNonce } from "../utils/nonce";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";

const styleElementMap: Map<Document, HTMLStyleElement> = new Map();

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (nodeRef: RefObject<HTMLDivElement>): void => {
  useIsomorphicLayoutEffect(() => {
    const parentDocument = nodeRef.current ? nodeRef.current.ownerDocument : document;

    if (typeof parentDocument !== "undefined" && !styleElementMap.has(parentDocument)) {
      const styleElement = parentDocument.createElement("style");
      styleElement.innerHTML = styles;
      styleElementMap.set(parentDocument, styleElement);

      // Conform to CSP rules by setting `nonce` attribute to the inline styles
      const nonce = getNonce();
      if (nonce) styleElement.setAttribute("nonce", nonce);

      parentDocument.head.appendChild(styleElement);
    }
  }, []);
};
