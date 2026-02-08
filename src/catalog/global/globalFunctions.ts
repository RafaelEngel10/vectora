import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../extras/basics.js';

export const global = {
    searchValue: (el: HTMLElement, args: string): void => {
        const parts = args.split(',');
    }
}