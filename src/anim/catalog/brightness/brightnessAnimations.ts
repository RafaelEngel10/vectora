import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../../basics.js';

const e: number = 2.71828;

export const brightness = {
    halo: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const intensity: any = parseFloat(parts[0] || '5');
        const color: any = parts[1] || '#fff';
        const duration: number = toMs(parts[2] || '600');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        appendTransition(el, `text-shadow ${duration}ms`);
        
        requestAnimationFrame(() => (
            el.style.filter = `brightness(${intensity/e})`,
            el.style.textShadow = `2px 2px ${intensity}px ${color}`
        ));
    },


    pillar: (el: any, args: any) => {

    },


    neon: (el: any, args: any) => {

    },


    fadeLight: (el: any, args: any) => {

    }
}