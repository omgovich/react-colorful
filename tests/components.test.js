import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import ColorPicker from "../src/";

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

it("Renders proper HTML", () => {
  const result = render(<ColorPicker color="#F00" />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Works with no props", () => {
  const result = render(<ColorPicker />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Accepts an additional `className`", () => {
  const result = render(<ColorPicker className="custom-picker" />);

  const hasClass = result.container.firstChild.classList.contains("custom-picker");
  expect(hasClass).toBe(true);
});

it("Doesn't trigger `onChange` after mounting", () => {
  const handleChange = jest.fn();
  render(<ColorPicker onChange={handleChange} />);

  expect(handleChange).not.toHaveReturned();
});

it("Triggers `onChange` after a mouse interaction", async () => {
  const handleChange = jest.fn();
  const result = render(<ColorPicker onChange={handleChange} />);
  const saturation = result.container.querySelector(".react-colorful__saturation .interactive");

  fireEvent(saturation, new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0, bubbles: true }));
  fireEvent(saturation, new FakeMouseEvent("mousemove", { pageX: 10, pageY: 10, bubbles: true }));

  expect(handleChange).toHaveReturned();
});

it("Triggers `onChange` after a touch interaction", async () => {
  const handleChange = jest.fn();
  const result = render(<ColorPicker onChange={handleChange} />);
  const hue = result.container.querySelector(".react-colorful__hue .interactive");

  fireEvent.touchStart(hue, { touches: [{ pageX: 0, pageY: 0, bubbles: true }] });
  fireEvent.touchMove(hue, { touches: [{ pageX: 100, pageY: 0, bubbles: true }] });

  expect(handleChange).toHaveReturned();
});
