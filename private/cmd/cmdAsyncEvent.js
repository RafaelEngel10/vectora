import { macron } from "../../src/console.js";
import { cmd } from '../../dist/private/cmd/spec/cmdFunctionsVectora.js';
import { between } from "../../src/strings.js";

export function cmdAsyncEvent(actions) {

    for (const action of actions) {
        const Action = action.action;           //a constante action é um objeto, tem que fazer action.action pra pegar a string.
        if (Action.includes('(')) {
            const Function = Action.split('(')[0];
            
            const fn = cmd[Function];
            const args = between(Action, '(', ')');
            fn(args);
        } else {
            
        }
    }
}