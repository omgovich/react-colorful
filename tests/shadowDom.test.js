import React from "react";
import { render, cleanup } from "@testing-library/react";
import { HexColorPicker } from "../src";

const hosts = [];

afterEach(() => {
  cleanup();
  while (hosts.length) hosts.pop().remove();
});

it("Injects styles into the closest ShadowRoot when mounted inside one", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  hosts.push(host);

  const shadow = host.attachShadow({ mode: "open" });
  const mount = document.createElement("div");
  shadow.appendChild(mount);

  render(<HexColorPicker color="#F00" />, { container: mount });

  // `useStyleSheet` runs in a layout effect, so the <style> is present synchronously.
  expect(shadow.querySelector("style")).not.toBeNull();
});
