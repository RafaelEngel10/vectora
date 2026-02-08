import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../extras/basics.js';

export const weightAnimations = {
    skinny: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const intensity: any = parseFloat(parts[0] || '2');
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        appendTransition(el, `font-weight ${duration}ms ease`);
        
        requestAnimationFrame(() => {
            el.style.fontWeight = `${intensity / 10}`;
        });
    },

    heavy: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const intensity: any = parseFloat(parts[0] || '2');
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        appendTransition(el, `font-weight ${duration}ms ease`);

        requestAnimationFrame(() => {
            el.style.fontWeight = `${intensity * 2}`;
        });
    }
}