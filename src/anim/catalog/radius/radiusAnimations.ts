import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, appendTransition  } from '../../../basics.js';

export const radiusAnimations = {
    round: (el: any, args: any) => {
        const parts = args ? args.split(',').map((p: any) => p.trim()) : [];
        const roundNumber: number = parseFloat(parts[0]) || 10;
        const duration: number = toMs(parts[1] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth;

        el.style.borderRadius = '0px';

        appendTransition(el, `border-radius ${duration}ms ease-in-out`);

        requestAnimationFrame(() => {
            el.style.borderRadius = `${roundNumber}px`;
        });
    },

    corner: (el: any, args: any) => {
        const parts = args ? args.split(',').map((p: any) => p.trim()) : [];
        const specific: string = parts[0] || 'all';
        const round: number = parseFloat(parts[1] || '15');
        const duration: number = toMs(parts[2] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 
        
        let ver: boolean;
        switch (specific) {
            case 'all': 
                ver = appendTransition(el, `border-radius ${duration}ms ease`);
                if (ver === false) appendTransition(el,`border-radius ${duration}ms ease`);
                requestAnimationFrame(() => {el.style.borderRadius = `${round}px`;});
                break;
            case 'top-left':
                ver = appendTransition(el, `border-top-left-radius ${duration}ms ease`);
                if (ver === false) appendTransition(el,`border-top-left-radius ${duration}ms ease`);
                requestAnimationFrame(() => {el.style.borderTopLeftRadius = `${round}px`;});
                break;
            case 'top-right':
                ver = appendTransition(el, `border-top-right-radius ${duration}ms ease`);
                if (ver === false) appendTransition(el,`border-top-right-radius ${duration}ms ease`);
                requestAnimationFrame(() => {el.style.borderTopRightRadius = `${round}px`;});
                break;
            case 'bottom-left':
                ver = appendTransition(el, `border-bottom-left-radius ${duration}ms ease`);
                if (ver === false) appendTransition(el,`border-bottom-left-radius ${duration}ms ease`);
                requestAnimationFrame(() => {el.style.borderBottomLeftRadius = `${round}px`;});
                break;
            case 'bottom-right':
                ver = appendTransition(el, `border-bottom-right-radius ${duration}ms ease`);
                if (ver === false) appendTransition(el,`border-bottom-right-radius ${duration}ms ease`);
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
    let ver: boolean;

    switch (parts) {
        case 'top-right':
            ver = appendTransition(el, `border-top-left ${duration}ms ease, border-bottom-left ${duration}ms ease, border-bottom-right ${duration}ms ease`)
            if (ver === false) appendTransition(el,`border-top-left ${duration}ms ease, border-bottom-left ${duration}ms ease, border-bottom-right ${duration}ms ease`);
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        case 'top-left':
            ver = appendTransition(el, `border-top-right ${duration}ms ease, border-bottom-left ${duration}ms ease, border-bottom-right ${duration}ms ease`)
            if (ver === false) appendTransition(el,`border-top-right ${duration}ms ease, border-bottom-left ${duration}ms ease, border-bottom-right ${duration}ms ease`);
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopRightRadius = `${round}px`;
            });
            break;
        case 'bottom-right':
            appendTransition(el,
                `border-top-left ${duration}ms ease, border-bottom-left ${duration}ms ease, border-top-right ${duration}ms ease`);
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderTopRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        case 'bottom-left':
            appendTransition(el,
                `border-top-left ${duration}ms ease, border-top-right ${duration}ms ease, border-bottom-right ${duration}ms ease`);
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