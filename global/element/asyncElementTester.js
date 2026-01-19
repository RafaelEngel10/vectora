import { cmdAsyncEvent } from '../../private/cmd/cmdAsyncEvent.js';
import { AsyncEvents } from './asyncEvents.js';
import { macron } from '../../console.js';

export function AsyncTester(selector, actions) {
    const Selector = selector.split('@')[1];

    switch (Selector) {
        case 'cmd':
            cmdAsyncEvent(actions)
            break;
        case 'vectora':
            macron('info', `AsyncEvent ${Selector}`);
            break;
    }
    return;
}