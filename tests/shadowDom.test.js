import React from "react";
import { render, cleanup } from "@testing-library/react";
import { HexColorPicker } from "../src";

afterEach(cleanup);

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

it("Injects styles into the closest ShadowRoot when mounted inside one", async () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });
  const mount = document.createElement("div");
  shadow.appendChild(mount);

  render(<HexColorPicker color="#F00" />, { container: mount });

  await sleep(500);

  expect(shadow.querySelector("style")).not.toBeNull();
});
