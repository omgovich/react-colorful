/* eslint-disable no-extra-boolean-cast */
import { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { getOwnerDocument } from "../utils/ownerDocument";
import { getNonce } from "../utils/nonce";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";

const styleElementMap: Map<Document | ShadowRoot, HTMLStyleElement> = new Map();

/**
 * Injects CSS code into the document's <head>
 */
export const useStyleSheet = (nodeRef: RefObject<HTMLDivElement>): void => {
  useIsomorphicLayoutEffect(() => {
    const ownerDocument = getOwnerDocument(nodeRef.current);
    const parentDocument = ownerDocument || document;
    if (
      parentDocument &&
      typeof parentDocument !== "undefined" &&
      !styleElementMap.has(parentDocument)
    ) {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = styles;
      styleElementMap.set(parentDocument, styleElement);

      // Conform to CSP rules by setting `nonce` attribute to the inline styles
      const nonce = getNonce();
      if (nonce) styleElement.setAttribute("nonce", nonce);
      if (parentDocument instanceof ShadowRoot) {
        parentDocument.appendChild(styleElement);
      } else {
        parentDocument.head.appendChild(styleElement);
      }
    }
  }, []);
};
