// The default CSS mock has no markup; use one with an SVG data URL like the real stylesheet.
// `require` instead of `import` keeps the mock registered before the library loads.
jest.mock("./__mocks__/styles.css.mock.ts", () => ({
  __esModule: true,
  default: ".a{background:url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"/>')}",
}));

const React = require("react");
const { render, cleanup } = require("@testing-library/react");
const { HexColorPicker, HexAlphaColorPicker } = require("../src");

afterEach(cleanup);

it("Injects styles into the root element when the document has no <head>", () => {
  // Zotero renders documents without a <head> (#216)
  const doc = document.implementation.createHTMLDocument("");
  doc.head.remove();
  expect(doc.head).toBeNull();
  const mount = doc.createElement("div");
  doc.body.appendChild(mount);

  render(<HexColorPicker color="#F00" />, { container: mount });

  expect(doc.documentElement.lastChild.tagName).toBe("STYLE");
});

it("Keeps the CSS intact in a headless XHTML document", () => {
  // `innerHTML` would turn the SVG in the CSS into an element here
  const doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html");
  const body = doc.createElementNS("http://www.w3.org/1999/xhtml", "body");
  doc.documentElement.appendChild(body);
  const mount = doc.createElementNS("http://www.w3.org/1999/xhtml", "div");
  body.appendChild(mount);

  render(<HexAlphaColorPicker color="#F008" />, { container: mount });

  const style = doc.documentElement.lastChild;
  expect(style.tagName.toLowerCase()).toBe("style");
  expect(style.children.length).toBe(0);
  expect(style.textContent).toContain("<svg");
});
