import fs from "fs";

export function writeToFile(path, content) {
    fs.writeFileSync(path, content, { encoding: "utf-8" });
    return;
}

export function appendToFile(path, content) {
    fs.appendFileSync(path, content, { enconding: "utf-8" });
    return;
}