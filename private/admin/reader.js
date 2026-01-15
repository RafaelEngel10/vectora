import fs from "fs";

export function readTxtFile(path) {
  const content = fs.readFileSync(path, { encoding: "utf-8" });
  return content;
}