# CLAUDE.md

## Commands

- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npm run check-types`
- **Test (with coverage):** `npm run test`
- **Test single file:** `npx jest tests/utils.test.js`
- **Test single case:** `npx jest tests/components.test.js -t "HexColorPicker"`
- **Bundle size check:** `npm run size` (pickers must stay under 3.1 KB)
- **Demo dev server:** `npm run start-demo`

## Key constraint: bundle size

Every picker must stay under 3 KB gzipped (enforced by `size-limit` in package.json). This shapes all code decisions: `Object.assign` over spread (smaller output), keyCodes over key strings, no dependencies, manually optimized algorithms. Always run `npm run size` after changes that add code.

## Architecture

A ~2.8 KB color picker component library for React. Zero dependencies.

### Internal color model: HSVA

All pickers convert to/from HSVA (Hue/Saturation/Value/Alpha) internally. The external API varies by component (hex string, RGB object, HSL string, etc.) but the internal representation is always HSVA. Conversions live in `src/utils/convert.ts`.

### ColorModel pattern

Every picker is a thin wrapper that passes a `ColorModel<T>` to a shared base component. A `ColorModel` defines four things: `defaultColor`, `toHsva()`, `fromHsva()`, `equal()`. To add a new color format, define a new `ColorModel` constant and wrap `ColorPicker` (or `AlphaColorPicker` for formats with opacity).

### Component hierarchy

- `ColorPicker` — base layout: `Saturation` + `Hue`
- `AlphaColorPicker` — extends base with an `Alpha` slider
- `Saturation` — 2D interactive area (x=saturation, y=value inverted)
- `Hue` / `Alpha` — 1D sliders
- `Interactive` — shared mouse/touch/keyboard handler for all controls. Handles touch vs mouse discrimination, cross-iframe support (via `ownerDocument.defaultView`), passive touch event workaround, and pointer-release-outside-window detection. Be aware of these edge cases when modifying it.

### State management

`useColorManipulation` is the central hook. It holds HSVA state, converts between HSVA and the picker's external format via the `ColorModel`, and fires `onChange`/`onChangeEnd` callbacks. `onChange` fires on every pointer move; `onChangeEnd` fires on pointer-up or key-up. The hook preserves hue/saturation when brightness goes to 0 or 1 (a common color picker UX issue).

### CSS

Styles are inlined in JS (no external CSS files). `useStyleSheet` injects a `<style>` tag once. CSP nonce support via `setNonce()` from `src/utils/nonce.ts`. Users customize appearance by overriding `.react-colorful__*` class names.

### Build

Microbundle produces CJS, ESM, UMD, and `.mjs` outputs. The library is tree-shakeable (`sideEffects: false`). CSS is inlined at build time via `--css inline`.

## Testing

Tests use `@testing-library/react` with `jest-esm-jsx-transform` for JSX in `.js` test files. The test setup mocks `HTMLElement.getBoundingClientRect` (jsdom doesn't support layout) and uses a custom `FakeMouseEvent` class to provide `pageX`/`pageY` (not supported by `fireEvent`). See the top of `tests/components.test.js` for both.

## Code style

- Prettier with 100 char line width
- Strict TypeScript, no `any`
- Do not add "Co-Authored-By" lines to commits or "Generated with Claude Code" to PR descriptions
- Update README.md when public API changes (new props, new components, changed behavior)
