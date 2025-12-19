import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../../basics.js';

const e: number = 2.71828;

export const brightness = {
    halo: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const intensity: any = parseFloat(parts[0] || '5');
        const color: any = parts[1] || '#fff';
        const duration: number = toMs(parts[2] || '600');

        ensureInlineBlockIfNeeded(el);
        el.style.transition = 'none';
        void el.offsetWidth; 

        el.style.transition = `text-shadow ${duration}ms`;
        
        requestAnimationFrame(() => (
            el.style.filter = `brightness(2)`,
            el.style.textShadow = `0px 0px ${intensity}px ${color}`
        ));
    },


    pillar: (el: any, args: any) => {

    },


    neon: (el: any, args: any) => {

    },


    fadeLight: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const duration: number = parseFloat(parts[0] || '600');

        ensureInlineBlockIfNeeded(el);
        el.style.transition = 'none';
        void el.offsetWidth;

        const filter = getComputedStyle(el).filter;
        if (!filter) console.error(`[Vectora] Sem brilho para reduzir: ${el}`);

        el.style.transition = `text-shadow ${duration}ms ease`;

        requestAnimationFrame(() => (
            el.style.textShadow = `0px 0px 0px rgba(0, 0, 0, .6)`
        ));

        el.style.transition = `filter ${duration}ms ease`;

        requestAnimationFrame(() => {
            el.style.filter = `brightness(0)`;
        });
    }
}