import fs from "fs";

export const ensureFolder = (folder: string) => {
  if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });
  fs.mkdirSync(folder, { recursive: true });
};

export const getVersion = (semver: string) => {
  return semver.slice(0, -2).replace(/^(\^|~)/, "");
};
