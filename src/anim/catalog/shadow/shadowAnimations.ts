import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../../basics.js';

export const shadowAnimations = {
    surge: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const direction: any = parts[0] || 'left';
        const intensity: any = parts[1] || '5px';
        const duration: number = toMs(parts[3] || '600ms');

        ensureInlineBlockIfNeeded(el);

        el.style.boxShadow = `0px 0px 0px rba(0, 0, 0, 0)`;
        el.style.transition = `box-shadow ${duration}ms ease`;

        let x: number = 0;
        let y: number = 0;

        switch (direction) {
            case 'left':
                x = -4;
                break;

            case 'right':
                x = 4;
                break;

            case 'top':
                y = 4;
                break;

            case 'bottom':
                y = -4;
                break;

            case 'top-left':
                x = -4;
                y = 4;
                break;

            case 'top-right':
                x = 4;
                y = 4;
                break;

            case 'bottom-left':
                x = -4;
                y = -4;
                break;

            case 'bottom-right':
                x = 4;
                y = -4;
                break;

            default:
                console.warn(`[Vectora] Sentido inválida para surge: ${direction}`);
                break;
        }

        requestAnimationFrame(() => (el.style.boxShadow = `${x}px ${y}px ${intensity}px rgba(0, 0, 0, .6)`));
    },


    fadeDusk: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const duration: any = parts[0] || '600';

        ensureInlineBlockIfNeeded(el);

        const shadowPosition = getComputedStyle(el).boxShadow;

        if (!shadowPosition) console.error(`[Vectora] Sem sombra para desfazer: ${el}`);

        el.style.boxShadow = `${shadowPosition}`;
        el.style.transition = `box-shadow ${duration}ms ease`;

        requestAnimationFrame(() => {
            el.style.boxShadow = `0px 0px 0px rgba(0, 0, 0, 0)`;
        });
    },

    purge: (el: any, args: any) => {
        ensureInlineBlockIfNeeded(el);
        console.debug(`[Vectora] Purge em construção, não use por enquanto. ${el}`);
    }

}