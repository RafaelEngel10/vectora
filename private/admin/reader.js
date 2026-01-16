import fs from "fs";

export function readTxtFile(path) {
  const content = fs.readFileSync(path, { encoding: "utf-8" });
  return content;
}

export function readLineperLine(path) {
  const content = fs.readFileSync(path, "utf-8");

  return content
    .split(/\r?\n/)
    .reduce((acc, line, index) => {
      if (line.trim() !== "") {
        acc[index + 1] = line;
      }
      return acc;
    }, {});
}