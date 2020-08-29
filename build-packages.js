const fs = require("fs");
const path = require("path");
const del = require("del");
const util = require("util");
const { kebabCase, map } = require("lodash");
const { peerDependencies } = require("./package.json");

// Convert NodeJS methods to promises in order to use them with `await` statement
const exec = util.promisify(require("child_process").exec);
const writeFile = util.promisify(fs.writeFile);
const makeDir = util.promisify(fs.mkdir);

// Read available package sources from the dir
const modulesArray = [
  "src/hex.tsx",
  "src/HexInput.ts",
  "src/hsl.tsx",
  "src/hslString.tsx",
  "src/hsv.tsx",
  "src/rgb.tsx",
  "src/rgbString.tsx",
];

// Bundles a package asynchronously
const bundlePackage = async (file) => {
  const { name } = path.parse(file);
  const isMainPackage = name === "hex";
  const outputDirPath = path.join(__dirname, isMainPackage ? "dist" : name);
  const manifestPath = path.join(outputDirPath, `package.json`);
  const bundlerPath = path.join(__dirname, "node_modules/.bin/microbundle");

  // Format a package name according to NPM's naming guide
  // https://docs.npmjs.com/files/package.json#name
  const packageName = `react-colorful-${kebabCase(name)}`;

  // Delete the previous package version if exists
  await del(outputDirPath);

  if (!isMainPackage) {
    // Create `package.json`
    const manifestCode = JSON.stringify({
      name: packageName,
      private: true,
      main: "index.js",
      module: "index.module.js",
      esmodule: "index.esmodule.js",
      "umd:main": "index.umd.js",
      source: `../${file}`,
      types: `${name}.d.ts`,
      peerDependencies,
    });

    await makeDir(outputDirPath);
    await writeFile(manifestPath, manifestCode);
  }

  // Bundler options
  const args = {
    name: packageName,
    cwd: isMainPackage ? __dirname : outputDirPath,
    output: `${outputDirPath}/index.js`,
    jsx: "React.createElement",
    "css-modules": "true",
    tsconfig: "tsconfig.build.json",
  };

  // Format CLI arguments string
  // `{ "a": "b" }` => "--key value"
  const argsString = map(args, (value, key) => `--${key} ${value}`).join(" ");

  // Run microbundle
  const { stdout } = await exec(`${bundlerPath} ${argsString}`);
  console.log(stdout);
};

console.log(`⚙️ Building ${modulesArray.length} packages...`);

// Process all packages in parallel
async function processPackages() {
  await Promise.all(modulesArray.map(bundlePackage));
  console.log(`🎺 All packages are built`);
}

processPackages();
