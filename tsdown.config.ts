import { defineConfig } from "tsdown";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { browserslistToTargets, transform } from "lightningcss";
import browserslist from "browserslist";
import * as terser from "terser";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: { tsconfig: "tsconfig.build.json" },
  sourcemap: true,
  clean: true,
  deps: { neverBundle: ["react", "react-dom"] },
  target: "es2018",
  minify: false,
  treeshake: true,
  plugins: [
    {
      name: "css-text",
      resolveId(source, importer) {
        if (source.endsWith(".css") && importer) {
          const fullPath = resolve(dirname(importer), source);
          return { id: "\0inline-styles:" + Buffer.from(fullPath).toString("base64") };
        }
      },
      load(id) {
        if (!id.startsWith("\0inline-styles:")) return;
        const filePath = Buffer.from(id.slice("\0inline-styles:".length), "base64").toString();
        const raw = readFileSync(filePath);
        const targets = browserslistToTargets(browserslist());
        const { code } = transform({ filename: filePath, code: raw, minify: true, targets });
        return `export default ${JSON.stringify(code.toString())}`;
      },
    },
    {
      name: "terser",
      async renderChunk(code, chunk) {
        if (chunk.fileName.endsWith(".d.ts") || chunk.fileName.endsWith(".d.cts") || chunk.fileName.endsWith(".d.mts")) {
          return;
        }
        const isCjs = chunk.fileName.endsWith(".cjs");
        const result = await terser.minify(code, {
          ecma: 2018,
          module: !isCjs,
          toplevel: true,
          compress: { passes: 2 },
          sourceMap: true,
        });
        return { code: result.code!, map: result.map as string };
      },
    },
  ],
});
