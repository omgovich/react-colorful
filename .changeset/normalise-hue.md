---
"react-colorful": patch
---

Fix the hue slider position, ARIA value and arrow keys for out-of-range hues like `hsl(-90, 100%, 50%)`; such colors are now emitted with the normalized hue (`hsl(270, 100%, 50%)`). Thanks to @blueDaydreaming725 (via #239)
