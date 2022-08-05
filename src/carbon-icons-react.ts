import fs from "fs";
import path from "path";
import metadata from "@carbon/icons/metadata.json";
import type { BuildIcons } from "@carbon/icons";
import packageJson from "../package.json";
import { ensureFolder } from "./utils";

interface GenCarbonIconsReactTypesOptions {
  /** @default Infinity */
  limit?: number;
}

export const genCarbonIconsReactTypes = (
  options?: GenCarbonIconsReactTypesOptions
) => {
  const limit = options?.limit || Infinity;
  const unique_sizes = new Set();
  const FOLDERS = ["es", "lib"];

  ensureFolder("dist");

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
          const folder_path = path.join("dist", FOLDER, folder ?? "");
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

  const preamble = `// Type definitions for @carbon/icons-react ${packageJson.dependencies[
    "@carbon/icons"
  ]
    .slice(0, -2)
    .replace(/\^/, "")}
// Project: https://github.com/carbon-design-system/carbon/tree/master/packages/icons-react
// Definitions by: Eric Liu <https://github.com/metonym>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.0

/** ${data.length} icons total */

export interface CarbonIconProps
  extends Omit<
    React.SVGProps<React.ReactSVGElement>,
    "ref" | "tabIndex" | "aria-hidden"
  > {
  /** @default 16 */
  size?: 16 | 20 | 24 | 32 | "16" | "20" | "24" | "32" | "glyph" | undefined;
  /** @default "http://www.w3.org/2000/svg" */
  xmlns?: string | undefined;
  /** @default "xMidYMid meet" */
  preserveAspectRatio?: string | undefined;
  "aria-hidden"?: string | undefined;
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
  tabIndex?: string | undefined;
  title?: string | undefined;
  viewBox?: string | undefined;
}

export type CarbonIconType = React.ForwardRefExoticComponent<
    CarbonIconProps & React.RefAttributes<SVGSVGElement>
>;\n\n`;
  const indexFile =
    preamble +
    data
      .map((item) => `export const ${item.moduleName}: CarbonIconType;\n`)
      .join("");

  fs.writeFileSync("dist/index.d.ts", indexFile);

  FOLDERS.forEach((FOLDER) => {
    fs.writeFileSync(
      path.join("dist", FOLDER, "index.d.ts"),
      data.map((item) => `export { ${item.moduleName} } from "../";\n`).join("")
    );
  });

  fs.writeFileSync(
    "dist/OTHER_FILES.txt",
    `es/index.d.ts\nlib/index.d.ts\n` +
      FOLDERS.flatMap((FOLDER) =>
        data.map((item) => `${FOLDER}/${item.filePath}\n`).join("")
      ).join("")
  );

  return {
    sizes: [...unique_sizes].sort(),
    total: data.length,
  };
};
