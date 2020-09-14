import React from "react";

export const Star = (props: React.SVGAttributes<SVGElement>): JSX.Element => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="currentColor"
      d="M12.9 2.6l2.3 5c.1.3.4.5.7.6l5.2.8c.9 0 1.2 1 .6 1.6l-3.8 3.9c-.2.2-.3.6-.3.9l.9 5.4c.1.8-.7 1.5-1.4 1.1l-4.7-2.6c-.3-.2-.6-.2-.9 0l-4.7 2.6c-.7.4-1.6-.2-1.4-1.1l.9-5.4c.1-.3-.1-.7-.3-.9l-3.8-3.9C1.7 10 2 9 2.8 8.9L8 8.1c.3 0 .6-.3.7-.6l2.3-5c.5-.7 1.5-.7 1.9.1z"
    />
  </svg>
);
