import { writeToFile } from "./writer.js";
import { exec } from "child_process";


export function AutoExecuteBookJavascriptFile(message) {
    const path = `./private/test/book.js`;
    
    writeToFile(path, message);

    exec(`node ${path}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Erro ao executar:", error.message);
            return;
        }

        if (stderr) {
            console.error("stderr:", stderr);
            return;
        }

        console.log(stdout);
    });
}

