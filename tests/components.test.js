import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import {
  HexColorInput,
  HexColorPicker,
  RgbColorPicker,
  RgbStringColorPicker,
  RgbaColorPicker,
  RgbaStringColorPicker,
  HslColorPicker,
  HslStringColorPicker,
  HslaColorPicker,
  HslaStringColorPicker,
  HsvColorPicker,
  HsvStringColorPicker,
  HsvaColorPicker,
  HsvaStringColorPicker,
  HexAlphaColorPicker,
} from "../src";

afterEach(cleanup);

// Fix to pass `pageX` and `pageY`
// See https://github.com/testing-library/react-testing-library/issues/268
class FakeMouseEvent extends MouseEvent {
  constructor(type, values = {}) {
    super(type, { buttons: 1, bubbles: true, ...values });

    Object.assign(this, {
      pageX: values.pageX || 0,
      pageY: values.pageY || 0,
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

it("Renders proper color picker markup", () => {
  const result = render(<HexColorPicker color="#F00" />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Renders proper alpha color picker markup", () => {
  const result = render(<RgbaStringColorPicker color="rgba(255, 0, 0, 0.5)" />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Works with no props", () => {
  const result = render(<HexColorPicker />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Accepts an additional `className`", () => {
  const result = render(<RgbColorPicker className="custom-picker" />);

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
  const hue = container.querySelector(".react-colorful__hue .react-colorful__interactive");

  fireEvent.touchStart(hue, { touches: [{ pageX: 0, pageY: 0 }] });
  fireEvent.touchMove(hue, { touches: [{ pageX: 100, pageY: 0 }] });

  expect(handleChange).not.toHaveBeenCalled();
});

it("Triggers `onChange` after a mouse interaction", async () => {
  const handleChange = jest.fn();
  const result = render(<RgbaColorPicker onChange={handleChange} />);
  const saturation = result.container.querySelector(
    ".react-colorful__saturation .react-colorful__interactive"
  );

  fireEvent(saturation, new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
  fireEvent(saturation, new FakeMouseEvent("mousemove", { pageX: 10, pageY: 10 }));

  expect(handleChange).toHaveReturned();
});

it("Triggers `onChange` after a touch interaction", async () => {
  const handleChange = jest.fn((hsv) => hsv);
  const initialValue = { h: 0, s: 100, v: 100 };
  const result = render(<HsvColorPicker color={initialValue} onChange={handleChange} />);
  const hue = result.container.querySelector(".react-colorful__hue .react-colorful__interactive");

  fireEvent.touchStart(hue, { touches: [{ pageX: 0, pageY: 0, bubbles: true }] });
  fireEvent.touchMove(hue, { touches: [{ pageX: 55, pageY: 0, bubbles: true }] });

  expect(handleChange).toHaveReturnedWith({ h: 180, s: 100, v: 100 });
});

it("Supports multitouch", async () => {
  const handleChange = jest.fn((hsva) => hsva);
  const initialValue = { h: 0, s: 100, v: 100, a: 0 };
  const result = render(<HsvaColorPicker color={initialValue} onChange={handleChange} />);
  const hue = result.container.querySelector(".react-colorful__hue .react-colorful__interactive");
  const alpha = result.container.querySelector(
    ".react-colorful__alpha .react-colorful__interactive"
  );

  const firstFingerBefore = { pageX: 0, pageY: 0, identifier: 0, bubbles: true };
  const firstFingerAfter = { pageX: 55, pageY: 0, identifier: 0, bubbles: true };

  const secondFingerBefore = { pageX: 0, pageY: 0, identifier: 1, bubbles: true };
  const secondFingerAfter = { pageX: 200, pageY: 0, identifier: 1, bubbles: true };

  const extraTouch = { pageX: 10, pageY: 10, identifier: 2, bubbles: true };

  fireEvent.touchStart(hue, {
    changedTouches: [firstFingerBefore],
    touches: [firstFingerBefore],
  });

  fireEvent.touchStart(alpha, {
    changedTouches: [secondFingerBefore],
    touches: [firstFingerBefore, secondFingerBefore],
  });

  fireEvent.touchMove(hue, { touches: [firstFingerAfter, secondFingerAfter] });
  fireEvent.touchMove(alpha, { touches: [extraTouch] }); // test touch fallback
  fireEvent.touchMove(alpha, { touches: [firstFingerAfter, secondFingerAfter] });

  expect(handleChange).toHaveReturnedWith({ h: 180, s: 100, v: 100, a: 1 });
});

it("Pointer doesn't follow the mouse if it was released outside of the document bounds", async () => {
  const handleChange = jest.fn();
  const result = render(<RgbaColorPicker onChange={handleChange} />);
  const saturation = result.container.querySelector(
    ".react-colorful__saturation .react-colorful__interactive"
  );

  // User presses and moves the cursor inside the window
  fireEvent(saturation, new FakeMouseEvent("mousedown", { pageX: 20, pageY: 10 })); // 1
  fireEvent(saturation, new FakeMouseEvent("mousemove", { pageX: 10, pageY: 10 })); // 2
  // User releases the mouse button outside of the document bounds with no `mouseup` event fired
  // User moves the cursor back to the document with no button pressed
  fireEvent(saturation, new FakeMouseEvent("mousemove", { pageX: 1, pageY: 50, buttons: 0 })); // 3

  expect(handleChange).toHaveReturnedTimes(2); // the last `mousemove` has to be ignored
});

it("Changes alpha channel value after an interaction", async () => {
  const handleChange = jest.fn((hsla) => hsla);
  const initialValue = { h: 100, s: 0, l: 0, a: 0 };

  const result = render(<HslaColorPicker color={initialValue} onChange={handleChange} />);
  const alpha = result.container.querySelector(
    ".react-colorful__alpha .react-colorful__interactive"
  );

  fireEvent(alpha, new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
  fireEvent(alpha, new FakeMouseEvent("mousemove", { pageX: 105, pageY: 0 }));

  expect(handleChange).toHaveReturnedWith({ h: 100, s: 0, l: 0, a: 1 });
});

it("Uses #rrggbbaa format if alpha channel value is less than 1", async () => {
  const handleChange = jest.fn((hex) => hex);
  const result = render(<HexAlphaColorPicker color="#112233" onChange={handleChange} />);
  const alpha = result.container.querySelector(
    ".react-colorful__alpha .react-colorful__interactive"
  );

  fireEvent(alpha, new FakeMouseEvent("mousedown", { pageX: 100, pageY: 0 }));
  fireEvent(alpha, new FakeMouseEvent("mousemove", { pageX: 0, pageY: 0 }));

  expect(handleChange).toHaveReturnedWith("#11223300");
});

// Fast clicks on mobile devices
// See https://github.com/omgovich/react-colorful/issues/55
it("Doesn't react on mouse events after a touch interaction", () => {
  const handleChange = jest.fn((hslString) => hslString);
  const result = render(<HslStringColorPicker color="hsl(100, 0%, 0%)" onChange={handleChange} />);
  const hue = result.container.querySelector(".react-colorful__hue .react-colorful__interactive");

  fireEvent.touchStart(hue, { touches: [{ pageX: 0, pageY: 0, bubbles: true }] }); // 1
  fireEvent.touchMove(hue, { touches: [{ pageX: 55, pageY: 0, bubbles: true }] }); // 2

  // Should be skipped
  fireEvent(hue, new FakeMouseEvent("mousedown", { pageX: 35, pageY: 0 })); // 3
  fireEvent(hue, new FakeMouseEvent("mousemove", { pageX: 105, pageY: 0 })); // 4

  expect(handleChange).toHaveReturnedTimes(2);
  expect(handleChange).toHaveReturnedWith("hsl(180, 0%, 0%)");
});

it("Captures arrow keys only", async () => {
  const handleChange = jest.fn((hex) => hex);
  const initialValue = "hsv(180, 90%, 90%)";

  const result = render(<HsvStringColorPicker color={initialValue} onChange={handleChange} />);
  const saturation = result.container.querySelector(
    ".react-colorful__saturation .react-colorful__interactive"
  );

  saturation.focus();
  const node = document.activeElement || document.body;

  fireEvent.keyDown(node, { keyCode: 36 }); // should be ignored
  fireEvent.keyDown(node, { keyCode: 37 }); // left
  fireEvent.keyDown(node, { keyCode: 40 }); // bottom

  expect(handleChange).toHaveReturnedTimes(2);
  expect(handleChange).toHaveReturnedWith("hsv(180, 85%, 85%)");

  fireEvent.keyDown(node, { keyCode: 38 }); // top
  fireEvent.keyDown(node, { keyCode: 39 }); // right
  fireEvent.keyDown(node, { keyCode: 41 }); // should be ignored

  expect(handleChange).toHaveReturnedTimes(4);
  expect(handleChange).toHaveReturnedWith(initialValue);
});

it("Changes saturation with arrow keys", async () => {
  const handleChange = jest.fn();
  const initialValue = { r: 80, g: 100, b: 120 };

  const result = render(<RgbColorPicker color={initialValue} onChange={handleChange} />);
  const hue = result.container.querySelector(
    ".react-colorful__saturation .react-colorful__interactive"
  );

  hue.focus();
  const node = document.activeElement || document.body;
  fireEvent.keyDown(node, { keyCode: 39 });
  fireEvent.keyDown(node, { keyCode: 40 });

  expect(handleChange).toHaveReturnedTimes(2);
});

it("Changes hue with arrow keys", async () => {
  const handleChange = jest.fn();
  const initialValue = { h: 180, s: 0, l: 50, a: 1 };

  const result = render(<HslColorPicker color={initialValue} onChange={handleChange} />);
  const hue = result.container.querySelector(".react-colorful__hue .react-colorful__interactive");

  hue.focus();
  const node = document.activeElement || document.body;
  fireEvent.keyDown(node, { keyCode: 39 }); // left

  expect(handleChange).toHaveReturnedTimes(1);
});

it("Changes alpha with arrow keys", async () => {
  const handleChange = jest.fn();
  const initialValue = { h: 180, s: 0, v: 50, a: 0.5 };

  const result = render(<HsvaColorPicker color={initialValue} onChange={handleChange} />);
  const alpha = result.container.querySelector(
    ".react-colorful__alpha .react-colorful__interactive"
  );

  alpha.focus();
  const node = document.activeElement || document.body;
  fireEvent.keyDown(node, { keyCode: 39 }); // right

  expect(handleChange).toHaveReturnedTimes(1);
});

it("Ignores keyboard commands if the pointer is already on a saturation edge", async () => {
  const handleChange = jest.fn();

  // Place pointer to the left-top corner of the saturation area
  const initialValue = "hsla(200, 0%, 100%, 1)";
  const result = render(<HslaStringColorPicker color={initialValue} onChange={handleChange} />);
  const saturation = result.container.querySelector(
    ".react-colorful__saturation .react-colorful__interactive"
  );

  saturation.focus();
  const node = document.activeElement || document.body;

  fireEvent.keyDown(node, { keyCode: 38 }); // top
  fireEvent.keyDown(node, { keyCode: 37 }); // left

  expect(handleChange).toHaveReturnedTimes(0);
});

it("Ignores keyboard commands if the pointer is already on a alpha edge", async () => {
  const handleChange = jest.fn();

  // Place pointer to the right side of the alpha area
  const initialValue = "hsva(0, 0%, 0%, 1)";
  const result = render(<HsvaStringColorPicker color={initialValue} onChange={handleChange} />);
  const saturation = result.container.querySelector(
    ".react-colorful__alpha .react-colorful__interactive"
  );

  saturation.focus();
  const node = document.activeElement || document.body;

  fireEvent.keyDown(node, { keyCode: 39 }); // right

  expect(handleChange).toHaveReturnedTimes(0);
});

it("Sets proper `aria-valuetext` attribute value", async () => {
  const handleChange = jest.fn();
  const result = render(<RgbaStringColorPicker color="rgb(0, 0, 0, 0)" onChange={handleChange} />);
  const saturation = result.container.querySelector(
    ".react-colorful__saturation .react-colorful__interactive"
  );
  const alpha = result.container.querySelector(
    ".react-colorful__alpha .react-colorful__interactive"
  );

  expect(saturation.getAttribute("aria-valuetext")).toBe("Saturation 0%, Brightness 0%");
  expect(alpha.getAttribute("aria-valuetext")).toBe("0%");

  fireEvent(saturation, new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
  fireEvent(saturation, new FakeMouseEvent("mousemove", { pageX: 500, pageY: 0 })); // '#ff0000'
  fireEvent(alpha, new FakeMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
  fireEvent(alpha, new FakeMouseEvent("mousemove", { pageX: 500, pageY: 0 }));

  expect(saturation.getAttribute("aria-valuetext")).toBe("Saturation 100%, Brightness 100%");
  expect(alpha.getAttribute("aria-valuetext")).toBe("100%");
});

it("Accepts any valid `div` attributes", () => {
  const result = render(<RgbStringColorPicker id="my-id" aria-hidden="false" />);

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Supports any event that a regular div does", () => {
  const handleHover = jest.fn();
  const result = render(<HsvaColorPicker onMouseEnter={handleHover} />);
  fireEvent.mouseEnter(result.container.firstChild);

  expect(handleHover).toHaveReturnedTimes(1);
});

it("Renders `HexColorInput` component properly", () => {
  const result = render(
    <HexColorInput className="custom-input" color="#F00" placeholder="AABBCC" />
  );

  expect(result.container.firstChild).toMatchSnapshot();
});

it("Fires `onChange` when user changes `HexColorInput` value", () => {
  const handleChange = jest.fn((hex) => hex);
  const result = render(<HexColorInput onChange={handleChange} />);
  const input = result.container.firstChild;

  fireEvent.change(input, { target: { value: "112233" } });

  expect(handleChange).toHaveReturnedWith("#112233");
});

it("Fires custom `onBlur` when `HexColorInput` has lost focus", () => {
  const handleBlur = jest.fn((e) => e.target.value);
  const result = render(<HexColorInput color="#ffffff" onBlur={handleBlur} />);
  const input = result.container.firstChild;

  fireEvent.blur(input);

  expect(handleBlur).toHaveReturnedWith("ffffff");
});

it("Displays `#` prefix in `HexColorInput` if `prefixed` is turned on", () => {
  const result = render(<HexColorInput color="111" prefixed />);
  const input = result.container.firstChild;
  expect(input.value).toBe("#111");

  fireEvent.change(input, { target: { value: "112233" } });
  expect(input.value).toBe("#112233");
});

it("Allows to enter `#rgba` and `#rrggbbaa` in `HexColorInput` if `alpha` is turned on", () => {
  const result = render(<HexColorInput color="112233" alpha />);
  const input = result.container.firstChild;
  expect(input.value).toBe("112233");

  fireEvent.change(input, { target: { value: "11223344" } });
  expect(input.value).toBe("11223344");

  fireEvent.change(input, { target: { value: "abcd" } });
  expect(input.value).toBe("abcd");
});

it("Does not allow to enter `#rrggbbaa` in `HexColorInput` if `alpha` is turned off", () => {
  const result = render(<HexColorInput color="aabbcc" />);
  const input = result.container.firstChild;
  expect(input.value).toBe("aabbcc");

  fireEvent.change(input, { target: { value: "11223344" } });
  expect(input.value).toBe("112233");
});
