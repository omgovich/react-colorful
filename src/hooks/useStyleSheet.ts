import { RefObject } from "react";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { getNonce } from "../utils/nonce";

// Bundler is configured to load this as a processed minified CSS-string
import styles from "../css/styles.css";

type Root = Document | ShadowRoot;

const styleElementMap: Map<Root, HTMLStyleElement> = new Map();

/**
 * Injects CSS code into the closest root node (Document or ShadowRoot)
 * so the picker is styled correctly when mounted inside a shadow tree
 * or a separate document (e.g. an iframe).
 */
export const useStyleSheet = (nodeRef: RefObject<HTMLDivElement>): void => {
  useIsomorphicLayoutEffect(() => {
    const node = nodeRef.current;
    if (typeof document === "undefined" || !node) return;

    // `getRootNode()` returns the closest ShadowRoot if the picker lives in one,
    // otherwise the owning Document. Falls back to `ownerDocument` for IE11,
    // which has neither `getRootNode` nor Shadow DOM. For disconnected nodes
    // `getRootNode()` can return an arbitrary ancestor (e.g. an Element), so
    // we discriminate via `head`/`host` and fall back to `ownerDocument`.
    const raw = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    const root = (raw && ("head" in raw || "host" in raw) ? raw : node.ownerDocument) as Root;
    if (styleElementMap.has(root)) return;

    // Document has `head`; ShadowRoot doesn't — use it to pick the injection target.
    const target = "head" in root ? root.head : root;
    const styleElement = (target.ownerDocument || document).createElement("style");
    styleElement.innerHTML = styles;

    // Conform to CSP rules by setting `nonce` attribute to the inline styles
    const nonce = getNonce();
    if (nonce) styleElement.setAttribute("nonce", nonce);

    styleElementMap.set(root, styleElement);
    target.appendChild(styleElement);
  }, []);
};
