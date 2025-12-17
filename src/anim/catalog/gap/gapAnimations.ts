import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../../basics.js';

export const gapAnimations = {
    bloom: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const finalGap: number = parseFloat(parts[0] || '5');
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        el.style.transition = 'none';
        void el.offsetWidth; 

        const initialGap = getComputedStyle(el).gap;

        el.style.gap = `${initialGap}px`;
        el.style.transition = `gap ${duration}ms`;

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
        el.style.transition = 'none';
        void el.offsetWidth; 

        el.style.rowGap = `0px`;
        el.style.columnGap = `0px`;

        if (direction === 'row') {
            el.style.transition = `row-gap ${duration/2}ms`;

            requestAnimationFrame(() => {
                el.style.rowGap = `${intensity}px`;
            }); 

            el.style.transition = `column-gap ${duration/2}ms`;

            requestAnimationFrame(() => {
                el.style.columnGap = `${intensity}px`;
            });
            
        } else {
            el.style.transition = `column-gap ${duration/2}ms`;

            requestAnimationFrame(() => {
                el.style.columnGap = `${intensity}px`;
            });

            el.style.transition = `row-gap ${duration/2}ms`;

            requestAnimationFrame(() => {
                el.style.rowGap = `${intensity}px`;
            });
        }
    }
}