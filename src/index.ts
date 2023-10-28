import type { BuildIcons } from "@carbon/icons";
import metadata from "@carbon/icons/metadata.json";
import fs from "node:fs";
import path from "node:path";
import { BASE_INDEX_FILE, FOLDERS } from "./constants";
import { ensureFolder } from "./utils";

interface Options {
  /**
   * Specify a max number of icons to generate.
   * Useful for testing without generating all icons (2k+).
   * @default Infinity
   */
  limit?: number;

  /**
   * Specify a custom output directory.
   * @default "dist"
   */
  outputDir?: string;
}

export const genCarbonIconsReactTypes = (options?: Options) => {
  const limit = options?.limit ?? Infinity;
  const output_dir = options?.outputDir ?? "dist";
  const unique_sizes = new Set<string | number>();

  ensureFolder(output_dir);

  const data = (metadata as BuildIcons).icons
    .slice(0, limit)
    .flatMap((icon) => {
      icon.sizes.forEach(unique_sizes.add.bind(unique_sizes));

      const folder = icon.namespace[0];
      const icons = [
        ...new Set([
          ...icon.output.map((obj) => {
            if (/(16|20|24|32)/.test(obj.moduleName.slice(-2))) {
              return obj.moduleName.slice(0, -2);
            } else {
              return obj.moduleName;
            }
          }),
        ]),
      ];

      return icons.flatMap((moduleName) => {
        FOLDERS.forEach((FOLDER) => {
          const folder_path = path.join(output_dir, FOLDER, folder ?? "");
          const file_path = path.join(folder_path, moduleName + ".d.ts");

          if (folder && !fs.existsSync(folder_path)) {
            ensureFolder(folder_path);
          }

          fs.writeFileSync(
            file_path,
            `export { ${moduleName} as default } from "${
              folder ? "../" : ""
            }../";\n`
          );
        });

        return {
          filePath: path.join(folder ?? "", moduleName + ".d.ts"),
          moduleName,
        };
      });
    });

  const preamble = fs.readFileSync(
    path.resolve(import.meta.dir, "./preamble.d.ts"),
    "utf8"
  );
  const indexFile =
    `/** ${data.length} icons total */\n\n${preamble}\n\n` +
    data
      .map((item) => `export const ${item.moduleName}: CarbonIconType;\n`)
      .join("");

  fs.writeFileSync(path.join(output_dir, BASE_INDEX_FILE), indexFile);

  FOLDERS.forEach((FOLDER) => {
    fs.writeFileSync(
      path.join(output_dir, FOLDER, BASE_INDEX_FILE),
      data.map((item) => `export { ${item.moduleName} } from "../";\n`).join("")
    );
  });

  fs.writeFileSync(
    path.join(output_dir, "OTHER_FILES.txt"),
    `es/${BASE_INDEX_FILE}\nlib/${BASE_INDEX_FILE}\n` +
      FOLDERS.flatMap((FOLDER) =>
        data.map((item) => `${FOLDER}/${item.filePath}\n`).join("")
      ).join("")
  );

  return {
    total: data.length,
  };
};
