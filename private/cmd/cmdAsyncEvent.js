import { macron } from "../../src/console.js";
import { cmd } from '../../dist/private/cmd/spec/cmdFunctionsVectora.js';

const actions = 'message: log(Comando aceito...)';
const cmdCommands = cmd;

cmdAsyncEvent(actions);


export function cmdAsyncEvent(actions) {
    macron('log', 'Executando cmdAsyncEvent.');

    const newActions = actions.trim();
    const parts = newActions.split(':');

    const newParts = parts[1].trim().split('(');
    const part = parts[1].trim().split('(')[0];

    const fn = cmdCommands[part];

    if (!fn) {
        macron('error', `Comando não reconhecido: ${part}`);
        return;
    }

    fn(newParts);
}