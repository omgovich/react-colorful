import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import {
  OklabColorPicker,
  OklabaColorPicker,
  OklabStringColorPicker,
  OklabaStringColorPicker,
} from "../src";
import { inGamut, maxChroma } from "../src/utils/oklchGamut";
import { internalToOklcha } from "../src/utils/oklch";
import {
  equalOklabString,
  formatOklab,
  formatOklaba,
  oklabaToInternal,
  parseOklaba,
  internalToOklaba,
} from "../src/utils/oklab";

afterEach(cleanup);

// Fix to pass `pageX` and `pageY`
// See https://github.com/testing-library/react-testing-library/issues/268
class FakeMouseEvent extends MouseEvent {
  constructor(type, values = {}) {
    super(type, { buttons: 1, bubbles: true, ...values });
    Object.assign(this, { pageX: values.pageX || 0, pageY: values.pageY || 0 });
  }
}

Object.defineProperties(HTMLElement.prototype, {
  getBoundingClientRect: {
    get: () => () => ({ left: 5, top: 5, width: 100, height: 100 }),
  },
});

// A deterministic stand-in for `Math.random`
const random = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const toLch = ({ l, a, b }) => ({
  l,
  c: Math.hypot(a, b),
  h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
});

describe("conversion", () => {
  it("Writes the same color as the OKLCH pickers, in the cartesian form", () => {
    const next = random(3);
    for (let i = 0; i < 300; i++) {
      const gamut = i % 2 ? "p3" : "srgb";
      const internal = { l: next(), x: next(), h: next() * 360, a: 1 };
      const lab = internalToOklaba(internal, gamut);
      const lch = internalToOklcha(internal, gamut);
      const rad = (lch.h * Math.PI) / 180;
      // Both rounded at 5 digits: the two forms land within a few 1e-5 of each other
      expect(lab.l).toBe(lch.l);
      expect(lab.a).toBeCloseTo(lch.c * Math.cos(rad), 4);
      expect(lab.b).toBeCloseTo(lch.c * Math.sin(rad), 4);
    }
  });

  it("Reopens every color it emits at the same spot, inside the square", () => {
    const next = random(11);
    for (let i = 0; i < 1000; i++) {
      const gamut = i % 2 ? "p3" : "srgb";
      // Every tenth hue sits by the blue dip of sRGB
      const h = i % 10 ? next() * 360 : 263.5 + next();
      const color = internalToOklaba({ l: next(), x: next(), h, a: next() }, gamut);
      const { l, c, h: hue } = toLch(color);

      expect(c).toBeLessThanOrEqual(maxChroma(l, hue, gamut) + 1e-12);
      expect(inGamut(l, c, hue, gamut, 2e-3)).toBe(true);
      expect(internalToOklaba(oklabaToInternal(color, gamut), gamut)).toEqual(color);
    }
  });

  it("Gives a grey hue 0 and no chroma", () => {
    expect(oklabaToInternal({ l: 0.5, a: 0, b: 0, alpha: 1 }, "srgb")).toEqual({
      l: 0.5,
      x: 0,
      h: 0,
      a: 1,
    });
    expect(internalToOklaba({ l: 0.5, x: 0, h: 120, a: 1 }, "srgb")).toEqual({
      l: 0.5,
      a: 0,
      b: 0,
      alpha: 1,
    });
  });

  it("Shows a color outside the gamut at the edge", () => {
    expect(oklabaToInternal({ l: 0.6, a: -0.3, b: 0.3, alpha: 1 }, "srgb").x).toBe(1);
  });
});

describe("strings", () => {
  it("Parses OKLab strings", () => {
    const test = (input, output) => expect(parseOklaba(input)).toEqual(output);

    test("oklab(0.6 -0.1 0.05)", { l: 0.6, a: -0.1, b: 0.05, alpha: 1 });
    test("OKLAB(60% -25% 12.5%)", { l: 0.6, a: -0.1, b: 0.05, alpha: 1 });
    test("oklab(.6 .1 -.05 / 50%)", { l: 0.6, a: 0.1, b: -0.05, alpha: 0.5 });
    test("oklab(0.6 none +1e-1 / 0.3)", { l: 0.6, a: 0, b: 0.1, alpha: 0.3 });
    test("oklab(1.5 0 0)", { l: 1, a: 0, b: 0, alpha: 1 });
    test("oklch(0.6 0.1 20)", { l: 0, a: 0, b: 0, alpha: 1 });
    // OKLab has no angles
    test("oklab(0.6 0.1 20deg)", { l: 0, a: 0, b: 0, alpha: 1 });
  });

  it("Formats and compares OKLab strings", () => {
    const color = { l: 0.6, a: -0.1, b: 0.05, alpha: 0.5 };
    expect(formatOklab(color)).toBe("oklab(0.6 -0.1 0.05)");
    expect(formatOklaba(color)).toBe("oklab(0.6 -0.1 0.05 / 0.5)");
    expect(equalOklabString("oklab(0.6 -0.1 0.05)", "oklab(60% -25% 12.5%)")).toBe(true);
    expect(equalOklabString("oklab(0.6 0.1 0.5)", "oklab(0.6 0.15 0)")).toBe(false);
  });
});

describe("pickers", () => {
  const square = (container) =>
    container.querySelector(".react-colorful__saturation .react-colorful__interactive");

  it("Doesn't trigger `onChange` after mounting or on a gamut switch", () => {
    const handleChange = jest.fn();
    const color = { l: 0.6, a: -0.1, b: 0.05 };
    const { rerender } = render(<OklabColorPicker color={color} onChange={handleChange} />);
    rerender(<OklabColorPicker color={color} gamut="p3" onChange={handleChange} />);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("Emits an OKLab color after a mouse interaction", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <OklabColorPicker color={{ l: 0.6, a: -0.1, b: 0.05 }} onChange={handleChange} />
    );
    fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 105, pageY: 30 }));

    const [color] = handleChange.mock.calls[0];
    expect(Object.keys(color)).toEqual(["l", "a", "b"]);
    expect(color.l).toBe(0.75);
    // The right edge: the most vivid color of this lightness and hue
    const { l, c, h } = toLch(color);
    expect(c).toBeCloseTo(maxChroma(l, h, "srgb"), 3);
  });

  it("Keeps the hue of a grey on a gamut switch", () => {
    const handleChange = jest.fn((color) => color);
    const { container, rerender } = render(
      <OklabColorPicker color={{ l: 0.6, a: -0.1, b: 0.05 }} onChange={handleChange} />
    );
    const huePointer = () => container.querySelector(".react-colorful__hue-pointer");
    const hueBefore = huePointer().style.left;

    // To the left edge of the square: a grey, which has no hue to tell
    fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 5, pageY: 30 }));
    const grey = handleChange.mock.results[0].value;
    expect(grey).toEqual({ l: 0.75, a: 0, b: 0 });

    rerender(<OklabColorPicker color={grey} onChange={handleChange} gamut="p3" />);
    expect(huePointer().style.left).toBe(hueBefore);
  });

  it("Keeps the alpha in `alpha`, not in the `a` axis", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <OklabaColorPicker color={{ l: 0.6, a: -0.1, b: 0.05, alpha: 1 }} onChange={handleChange} />
    );
    const alpha = container.querySelector(".react-colorful__alpha .react-colorful__interactive");
    fireEvent(alpha, new FakeMouseEvent("mousedown", { pageX: 55, pageY: 0 }));

    expect(handleChange).toHaveBeenCalledWith({ l: 0.6, a: -0.1, b: 0.05, alpha: 0.5 });
  });

  it("Emits OKLab strings", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <OklabStringColorPicker color="oklab(0.6 -0.1 0.05)" onChange={handleChange} />
    );
    fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 55, pageY: 45 }));
    expect(handleChange.mock.calls[0][0]).toMatch(/^oklab\(0\.6 -?[\d.]+ -?[\d.]+\)$/);

    cleanup();
    const handleAlpha = jest.fn();
    const result = render(
      <OklabaStringColorPicker color="oklab(0.6 -0.1 0.05 / 1)" onChange={handleAlpha} />
    );
    const alpha = result.container.querySelector(
      ".react-colorful__alpha .react-colorful__interactive"
    );
    fireEvent(alpha, new FakeMouseEvent("mousedown", { pageX: 55, pageY: 0 }));
    expect(handleAlpha).toHaveBeenCalledWith("oklab(0.6 -0.1 0.05 / 0.5)");
  });
});
