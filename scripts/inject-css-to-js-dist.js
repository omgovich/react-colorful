const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");

const stylesPath = path.join(__dirname, "../dist/index.css");
const filesPath = path.join(__dirname, "../dist/*.js");

// Read minified CSS from the dist folder
const styles = fs.readFileSync(stylesPath, "utf8").replace(/"/g, '\\"');

// Inject CSS-code to the builded JS-files
const results = replace.sync({
  files: filesPath,
  from: ".react-colorful{}",
  to: styles,
});

console.log(`🔨 CSS code was successfully added to ${results.length} JS-files`);
