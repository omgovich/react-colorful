import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import ColorPicker from "../src/";

afterEach(cleanup);

it("renders proper HTML", () => {
  const result = render(<ColorPicker hex="#000" />);
  const container = result.container.firstChild;

  expect(container).toMatchSnapshot();
});

it("doesn't trigger onChange after mounting", () => {
  const handleChange = jest.fn(() => true);
  render(<ColorPicker onChange={handleChange} />);

  expect(handleChange).not.toHaveReturned();
});

it("triggers onChange after clicking", () => {
  const handleChange = jest.fn(() => true);
  const result = render(<ColorPicker onChange={handleChange} />);
  const saturation = result.container.querySelector(".react-colorful__saturation");

  fireEvent(saturation.firstChild, new MouseEvent("mousedown", { pageX: 0, pageY: 0 }));
  fireEvent(saturation.firstChild, new MouseEvent("mousemove", { pageX: 50, pageY: 50 }));

  expect(handleChange).toHaveReturned();
});
