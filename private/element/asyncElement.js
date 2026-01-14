import { cmdAsyncEvent } from '../cmd/cmdAsyncEvent.js';
import { macron } from '../../src/console.js';

const selector = '@cmd';
const rawEventName = 'root';
const actions = 'message: alert(Comando aceito...)';

asyncElement(selector, rawEventName, actions);

export function asyncElement(selector, rawEventName, actions) {
    const Selector = selector.split('@')[1];

    if (Selector === 'cmd') {
        macron('log', `Elemento assíncrono ${selector}`);
        cmdAsyncEvent(actions);
    }

}