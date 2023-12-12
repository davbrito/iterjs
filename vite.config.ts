import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { UserConfig, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json" assert { type: "json" };

const sourceDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(async () => {
  const inputs = await glob("**/*.ts?(x)", {
    ignore: "**/*.test.*",
    nodir: true,
    absolute: true,
    cwd: sourceDir,
  });

  return {
    plugins: [dts()],
    build: {
      lib: {
        entry: inputs,
        formats: ["es", "cjs"],
      },
      emptyOutDir: true,
      minify: false,
      sourcemap: true,
      rollupOptions: {
        external: Object.keys({
          ...pkg["dependencies"],
          ...pkg["peerDependencies"],
        }),
      },
    },
  } satisfies UserConfig;
});
