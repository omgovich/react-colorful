import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

interface Props {
  children: React.ReactNode;
}

export const ShadowDom = ({ children }: Props): JSX.Element => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const hostRef = useCallback((host: HTMLDivElement | null) => {
    if (host && !host.shadowRoot) {
      const root = host.attachShadow({ mode: "open" });
      setContainer(root.appendChild(document.createElement("div")));
    }
  }, []);

  return <div ref={hostRef}>{container && ReactDOM.createPortal(children, container)}</div>;
};
