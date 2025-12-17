import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../../basics.js';

export const radiusAnimations = {
    round: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const roundNumber: any = parseFloat(parts[0]) || 15;
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        el.style.transition = 'none';
        void el.offsetWidth; 

        el.style.borderRadius = `0px`;
        el.style.transition = `border-radius ${duration}ms ease-in-out`;

        requestAnimationFrame(() => {el.style.borderRadius = `${roundNumber}px`;});
    },

    corner: (el: any, args: any) => {
        const parts = args ? args.split(',').map((p: any) => p.trim()) : [];
        const specific = parts[0] || 'all';
        const round = parseFloat(parts[1] || '15');
        const duration = toMs(parts[2] || '600ms');

        ensureInlineBlockIfNeeded(el);

        el.style.transition = 'none';
        void el.offsetWidth; 

        switch (specific) {
            case 'all': 
                el.style.transition = `border-radius ${duration}ms ease`;
                requestAnimationFrame(() => {el.style.borderRadius = `${round}px`;});
                break;
            case 'top-left':
                el.style.transition = `border-top-left-radius ${duration}ms ease`;
                requestAnimationFrame(() => {el.style.borderTopLeftRadius = `${round}px`;});
                break;
            case 'top-right':
                el.style.transition = `border-top-right-radius ${duration}ms ease`;
                requestAnimationFrame(() => {el.style.borderTopRightRadius = `${round}px`;});
                break;
            case 'bottom-left':
                el.style.transition = `border-bottom-left-radius ${duration}ms ease`;
                requestAnimationFrame(() => {el.style.borderBottomLeftRadius = `${round}px`;});
                break;
            case 'bottom-right':
                el.style.transition = `border-bottom-right-radius ${duration}ms ease`;
                requestAnimationFrame(() => {el.style.borderBottomRightRadius = `${round}px`;});
                break;
            default:
                if (specific.includes('except')) {
                    execptCond(el, duration, round, specific);
                    break;
                }
                console.error(`[Vectora] Sem especificação para radius: ${specific}`);
                break;
        }
    }
}


function execptCond(el: any, duration: number, round: number, specific: string): void {
    const parts = specific.split('pt-')[1];

    switch (parts) {
        case 'top-right':
            el.style.transition = 
                `border-top-left ${duration}ms ease, border-bottom-left ${duration}ms ease, border-bottom-right ${duration}ms ease`;
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        case 'top-left':
            el.style.transition = 
                `border-top-right ${duration}ms ease, border-bottom-left ${duration}ms ease, border-bottom-right ${duration}ms ease`;
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopRightRadius = `${round}px`;
            });
            break;
        case 'bottom-right':
            el.style.transition = 
                `border-top-left ${duration}ms ease, border-bottom-left ${duration}ms ease, border-top-right ${duration}ms ease`;
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderTopRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        case 'bottom-left':
            el.style.transition = 
                `border-top-left ${duration}ms ease, border-top-right ${duration}ms ease, border-bottom-right ${duration}ms ease`;
            requestAnimationFrame(() => {
                el.style.borderTopRightRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        default: 
            console.error(`[Vectora] Sem exceção para radius: ${specific}`);
            break;
    }
}