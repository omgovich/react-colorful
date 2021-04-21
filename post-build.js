const fs = require('fs');

/**
 * Copies the `.module.js` output from Microbundle into `.mjs`
 * for use in Node.
 */
function copyModuleOutput() {
  fs.writeFileSync(
    `${process.cwd()}/dist/index.mjs`,
    fs.readFileSync(`${process.cwd()}/dist/index.module.js`)
  );

  fs.writeFileSync(
    `${process.cwd()}/dist/index.mjs.map`,
    fs.readFileSync(`${process.cwd()}/dist/index.module.js.map`)
  );
}

copyModuleOutput();
