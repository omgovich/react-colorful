import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { HexColorPicker, HexColorInput } from "../src";

afterEach(cleanup);

// Fix to pass `pageX` and `pageY`
// See https://github.com/testing-library/react-testing-library/issues/268
class FakeMouseEvent extends MouseEvent {
  constructor(type, values = {}) {
    const { pageX, pageY, ...rest } = values;
    super(type, rest);

    Object.assign(this, {
      pageX: pageX || 0,
      pageY: pageY || 0,
    });
  }
}

// Mock `HTMLElement.getBoundingClientRect` to be able to read element sizes
// See https://github.com/jsdom/jsdom/issues/135#issuecomment-68191941
Object.defineProperties(HTMLElement.prototype, {
  getBoundingClientRect: {
    get: () => () => ({
      left: 5,
      top: 5,
      width: 100,
      height: 100,
    }),
  },
});

it("Renders proper HTML", () => {
  const result = render(<HexColorPicker color="#F00" />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Works with no props", () => {
  const result = render(<HexColorPicker />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Accepts an additional `className`", () => {
  const result = render(<HexColorPicker className="custom-picker" />);

  const hasClass = result.container.firstChild.classList.contains("custom-picker");
  expect(hasClass).toBe(true);
});

it("Doesn't trigger `onChange` after mounting", () => {
  const handleChange = jest.fn();
  render(<HexColorPicker color="#c62182" onChange={handleChange} />);

  expect(handleChange).not.toHaveReturned();
});

it("Doesn't trigger `onChange` after controlled rerender", () => {
  const handleChange = jest.fn();
  const { rerender } = render(<HexColorPicker color="#c62182" onChange={handleChange} />);

  rerender(<HexColorPicker color="#c72282" onChange={handleChange} />);

  expect(handleChange).not.toHaveReturned();
});

it("Doesn't call `onChange` when user changes a hue of a grayscale color", () => {
  const handleChange = jest.fn();
  const { container } = render(<HexColorPicker color="#000" onChange={handleChange} />);
  const hue = container.querySelector(".react-colorful__hue .interactive");

  fireEvent.touchStart(hue, { touches: [{ pageX: 0, pageY: 0, bubbles: true }] });
  fireEvent.touchMove(hue, { touches: [{ pageX: 100, pageY: 0, bubbles: true }] });

  expect(handleChange).not.toHaveBeenCalled();
});

it("Triggers `onChange` after a mouse interaction", async () => {
  const handleChange = jest.fn();
  const result = render(<HexColorPicker onChange={handleChange} />);
  const saturation = result.container.querySelector(".react-colorful__saturation .interactive");

  fireEvent(saturation, new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0, bubbles: true }));
  fireEvent(saturation, new FakeMouseEvent("mousemove", { pageX: 10, pageY: 10, bubbles: true }));

  expect(handleChange).toHaveReturned();
});

it("Triggers `onChange` after a touch interaction", async () => {
  const handleChange = jest.fn();
  const result = render(<HexColorPicker color="f00" onChange={handleChange} />);
  const hue = result.container.querySelector(".react-colorful__hue .interactive");

  fireEvent.touchStart(hue, { touches: [{ pageX: 0, pageY: 0, bubbles: true }] });
  fireEvent.touchMove(hue, { touches: [{ pageX: 100, pageY: 0, bubbles: true }] });

  expect(handleChange).toHaveReturned();
});

it("Renders `HexInput` component properly", () => {
  const result = render(
    <HexColorInput className="custom-input" color="#F00" placeholder="AABBCC" />
  );

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Fires `onChange` when user changes `HexInput` value", () => {
  const handleChange = jest.fn((hex) => hex);
  const result = render(<HexColorInput onChange={handleChange} />);
  const input = result.container.firstChild;

  fireEvent.change(input, { target: { value: "112233" } });

  expect(handleChange).toHaveReturnedWith("#112233");
});
