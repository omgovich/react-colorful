<div align="center">
  <a href="https://omgovich.github.io/react-colorful">
    <img src="demo/src/assets/design.png" width="224" height="230" alt="react-colorful" />
  </a>
</div>

<div align="center">
  <a href="https://npmjs.org/package/react-colorful">
    <img alt="npm" src="https://img.shields.io/npm/v/react-colorful.svg?labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://travis-ci.org/omgovich/react-colorful">
    <img alt="CI" src="https://img.shields.io/travis/omgovich/react-colorful/master.svg?branch=master&labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://npmjs.org/package/react-colorful">
    <img alt="npm" src="https://img.shields.io/david/omgovich/react-colorful.svg?labelColor=da248d&color=6ead0a">
  </a>
  <a href="https://unpkg.com/react-colorful/dist/index.esmodule.js">
    <img alt="gzip size" src="http://img.badgesize.io/https://unpkg.com/react-colorful/dist/index.esmodule.js?compression=gzip&color=6ead0a">
  </a>
  
  
</div>

<div align="center">
  <strong>react-colorful</strong> is a tiny color picker component for modern React apps.
</div>

## Features

- **Small**: Just 1,5 KB (minified and gzipped). [Size Limit](https://github.com/ai/size-limit) controls the size.
- **Fast**: Built with hooks and functional components only.
- **Simple**: The interface is straight forward and easy to use.
- **Mobile-friendly**: Works well on mobile devices and touch screens.
- **No dependencies**

## Live demos

- [Website](https://omgovich.github.io/react-colorful)
- [CodeSandbox](https://codesandbox.io/s/react-colorful-demo-u5vwp)

## Install

```
npm install react-colorful --save
```

## Usage

```js
import ColorPicker from "react-colorful";
import "react-colorful/dist/index.css";

const YourComponent = () => {
  const [color, setColor] = useState("#aabbcc");
  return <ColorPicker color={color} onChange={setColor} />;
};
```

## Supported color models

The default **react-colorful**'s input/output format is HEX string (like `#ffffff`). In case you need another color model, we provide 5 additional color picker bundles.

<details>
  <summary>How to use another color model</summary>

| Import path                  | Value example                | Size (gzipped) |
| ---------------------------- | ---------------------------- | -------------- |
| `"react-colorful/rgb"`       | `{ r: 255, g: 255, b: 255 }` | ~1,4 KB        |
| `"react-colorful/rgbString"` | `"rgb(255, 255, 255)"`       | ~1,5 KB        |
| `"react-colorful/hsl"`       | `{ h: 0, s: 0, l: 100 }`     | ~1,2 KB        |
| `"react-colorful/hslString"` | `"hsl(0, 0%, 100%)"`         | ~1,3 KB        |
| `"react-colorful/hsv"`       | `{ h: 0, s: 0, v: 100 }`     | ~1,2 KB        |

**Code example:**

```js
import RgbColorPicker from "react-colorful/rgb";
import "react-colorful/dist/index.css";

const YourComponent = () => {
  const [color, setColor] = useState({ r: 50, g: 100, b: 150 });
  return <RgbColorPicker color={color} onChange={setColor} />;
};
```

[Live demo →](https://codesandbox.io/s/react-colorful-rgb-o9q0t?file=/src/App.js)

</details>

## Overriding styles

The easiest way to tweak react-colorful is to create another stylesheet to override the default styles.

```css
.react-colorful {
  height: 250px;
}
.react-colorful__saturation {
  bottom: 30px;
  border-radius: 3px 3px 0 0;
}
.react-colorful__hue {
  height: 30px;
  border-radius: 0 0 3px 3px;
}
.react-colorful__saturation-pointer {
  border-radius: 5px;
}
.react-colorful__hue-pointer {
  border-radius: 2px;
  width: 15px;
  height: inherit;
}
```

[See examples →](https://codesandbox.io/s/react-colorful-customization-demo-mq85z?file=/src/styles.css)

## Why react-colorful?

Today each dependency drags more dependencies and increases your project’s bundle size uncontrollably. But size is very important for everything that intends to work in a browser.

**react-colorful** is a simple color picker for those who care about their bundle size and client-side performance. It's fast and lightweight because:

- has no dependencies (no risks in terms of vulnerabilities, no unexpected bundle size changes);
- built with hooks and functional components only (no classes and polyfills for them);
- a lot of things that you probably don't need (like 8-digit HEX colors support) were stripped out from.

To show you the problem that **react-colorful** is trying to solve, we have performed a simple benchmark (using [size-limit](https://github.com/ai/size-limit)) against popular React color picker libraries:

| Name                      | Size (minified) | Size (gzipped) | Dependencies |
| ------------------------- | --------------- | -------------- | ------------ |
| **react-colorful v1.2.1** | **4 KB**        | **1,5 KB**     | **0**        |
| react-color v2.18.1       | 165 KB          | 40,6 KB        | 6            |
| react-input-color v3.0.1  | 59 KB           | 19,1 KB        | 7            |
| rc-color-picker v1.2.6    | 117 KB          | 32,4 KB        | 5            |

## Companies using react-colorful

<details>
  <summary><a href="https://resume.io">Resume.io</a> — online resume builder with over 7,800,000 users worldwide</summary>

  <a href="https://resume.io/">
    <img src="demo/src/assets/resume-io.png" width="873" alt="resume.io" />
  </a>
</details>

## Roadmap

- [x] Additional modules to support different color models (like HSL and RGB)
- [ ] HEX input component
- [ ] Preact support
