import { macron } from "../../console.js";
import { cmd } from '../../dist/private/cmd/spec/cmdFunctionsVectora.js';
import { between } from "../../strings.js";
import { appendToFile } from '../admin/writer.js';

export function cmdAsyncEvent(actions) {
    const source = `./private/in/instructor.txt`;   

    for (const action of actions) {
        const Action = action.action;           //a constante action é um objeto, tem que fazer action.action pra pegar a string.
        
        appendToFile(source, Action);
        appendToFile(source, '\n');
    }
}