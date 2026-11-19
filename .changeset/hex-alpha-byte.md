---
"react-colorful": patch
---

Fix the alpha of a HEX color changing when the picker moves another channel: `#ffffff88` no longer becomes `#ffffff87` and `#3366cc81` no longer becomes `#3366cc82` after the hue moves. The alpha of a HEX is a whole byte, it was rounded to two digits on the way in and on the way out, and 155 of the 256 bytes did not come back. Thanks to @simonkundrik
