---
"react-colorful": patch
---

Fix the alpha of a HEX color drifting when another channel changes: `#ffffff88` no longer becomes `#ffffff87`. Thanks to @simonkundrik (via #244)
