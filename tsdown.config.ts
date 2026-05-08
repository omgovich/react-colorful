import { defineConfig } from "tsdown";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[^]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;\}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: { tsconfig: "tsconfig.build.json" },
  sourcemap: true,
  clean: true,
  deps: { neverBundle: ["react", "react-dom"] },
  target: "es2018",
  minify: true,
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
        const css = readFileSync(filePath, "utf8");
        return `export default ${JSON.stringify(minifyCss(css))}`;
      },
    },
  ],
});
