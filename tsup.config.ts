import { defineConfig } from "tsup";
import { readFileSync } from "fs";
import { transform } from "esbuild";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  target: "es2018",
  minify: true,
  treeshake: true,
  esbuildPlugins: [
    {
      name: "css-text-minified",
      setup(build) {
        build.onLoad({ filter: /\.pcss$/ }, async (args) => {
          const css = readFileSync(args.path, "utf8");
          const { code } = await transform(css, { loader: "css", minify: true });
          return {
            contents: `export default ${JSON.stringify(code.trim())}`,
            loader: "js",
          };
        });
      },
    },
  ],
});
