import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../extras/basics.js';

export const gapAnimations = {
    bloom: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const finalGap: number = parseFloat(parts[0] || '5');
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        const initialGap = getComputedStyle(el).gap;
        if (!initialGap) el.style.gap = `0px`;
        else el.style.gap = `${initialGap}`;

        appendTransition(el, `gap ${duration}ms ease`);

        requestAnimationFrame(() => {
            el.style.gap = `${finalGap}px`;
        });
    },


    stagedBloom: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const direction: string = parts[0] || 'row';
        const intensity: number = parseFloat(parts[1] || '5');
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 
        el.style.rowGap = `0px`;
        el.style.columnGap = `0px`;

        if (direction === 'row') {
            appendTransition(el, `row-gap ${duration}ms ease`);

            requestAnimationFrame(() => {
                el.style.rowGap = `${intensity}px`;
            }); 

             appendTransition(el, `column-gap ${duration}ms ease`);

            requestAnimationFrame(() => {
                el.style.columnGap = `${intensity}px`;
            });
            
        } else {
             appendTransition(el, `column-gap ${duration}ms ease`);

            requestAnimationFrame(() => {
                el.style.columnGap = `${intensity}px`;
            });

             appendTransition(el, `row-gap ${duration}ms ease`);

            requestAnimationFrame(() => {
                el.style.rowGap = `${intensity}px`;
            });
        }
    }
}