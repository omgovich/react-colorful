import React from "react";
import { render, cleanup } from "@testing-library/react";
import { setNonce, HexColorPicker } from "../src";

afterEach(cleanup);

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

it("Signs the `style` element with a nonce", async () => {
  setNonce("some-hash");
  render(<HexColorPicker color="#F00" />);

  await sleep(500); // workaround to wait until `useEffect` callback is complete

  const styleElement = document.head.querySelector("style");
  expect(styleElement.getAttribute("nonce")).toBe("some-hash");
});
