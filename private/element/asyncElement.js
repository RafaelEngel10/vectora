import { cmdAsyncEvent } from '../cmd/cmdAsyncEvent.js';
import { AsyncEvents } from './asyncEvents.js';
import { macron } from '../../src/console.js';

export function asyncElement(selector, rawEventName, actions) {
    const Selector = selector.split('@')[1];

    if (Selector === 'cmd') {
        macron('log', `Elemento assíncrono ${selector}`);
        cmdAsyncEvent(actions);
    }

    if (Selector === 'vectora') {
        macron('log', `Elemento assíncrono ${selector}`);
        AsyncEvents(selector, rawEventName, actions);
    }
}