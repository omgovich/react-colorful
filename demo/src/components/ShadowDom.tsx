import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

interface Props {
  children: React.ReactNode;
}

export const ShadowDom = ({ children }: Props): JSX.Element => {
  const [root, setRoot] = useState<ShadowRoot | null>(null);

  const hostRef = useCallback((host: HTMLDivElement | null) => {
    if (host && !host.shadowRoot) {
      setRoot(host.attachShadow({ mode: "open" }));
    }
  }, []);

  // @types/react-dom 17 types the portal container as Element, though React accepts a ShadowRoot
  return (
    <div ref={hostRef}>{root && ReactDOM.createPortal(children, (root as unknown) as Element)}</div>
  );
};
