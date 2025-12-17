import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../../basics.js';

export const radiusAnimations = {
    round: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const roundNumber: any = parseFloat(parts[0]) || 15;
        const duration: number = toMs(parts[1] || '600ms');

        el.style.transition = 'none';
        ensureInlineBlockIfNeeded(el);

        el.style.borderRadius = `0px`;
        el.style.transition = `border-radius ${duration}ms ease-in-out`;

        requestAnimationFrame(() => {el.style.borderRadius = `${roundNumber}px`;});
    },
}