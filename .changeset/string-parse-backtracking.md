---
"react-colorful": patch
---

Fix the HSL, HSV and RGB string pickers freezing on a very long string of digits: 50,000 digits took 18 seconds to parse, now they take a millisecond. Thanks to @simonkundrik
