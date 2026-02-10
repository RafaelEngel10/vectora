import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../extras/basics.js';

export const shadowAnimations = {
    surge: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const direction: any = parts[0] || 'bottom-left';
        const intensity: any = parts[1] || '5';
        const duration: number = toMs(parts[2] || '600ms');

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 
        appendTransition(el, `box-shadow ${duration}ms ease`);
        el.style.boxShadow = ``;
        

        let x: number = 0;
        let y: number = 0;

        switch (direction) {
            case 'left': x = -4; break;
            case 'right': x = 4; break;
            case 'top': y = -4; break;
            case 'bottom': y = 4; break;
            case 'top-left': x = -4; y = -4; break;
            case 'top-right': x = 4; y = -4; break;
            case 'bottom-left': x = -4; y = 4; break;
            case 'bottom-right': x = 4; y = 4; break;
            default: console.warn(`[Vectora] Sentido inválido para surge: ${direction}`); break;
        }

        requestAnimationFrame(() => (el.style.boxShadow = `${x}px ${y}px ${intensity}px rgba(0, 0, 0, 0.6)`));
    },


    fadeDusk: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const duration: any = parts[0] || '600';

        ensureInlineBlockIfNeeded(el);
        
        void el.offsetWidth; 
        const shadowPosition = getComputedStyle(el).boxShadow;

        if (!shadowPosition) console.error(`[Vectora] Sem sombra para desfazer: ${el}`);

        el.style.boxShadow = `${shadowPosition}`;
        appendTransition(el,`box-shadow ${duration}ms ease`);

        requestAnimationFrame(() => {
            el.style.boxShadow = `0px 0px 0px rgba(0, 0, 0, 0)`;
        });
    },


    purge: (el: any, args: any) => {
        const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
        const duration: number = toMs(parts[0] || '600ms');

        const originalShadow = getComputedStyle(el).boxShadow;
        if (!originalShadow) console.error(`[Vectora] Sem sombra para alternar: ${el}`);

        ensureInlineBlockIfNeeded(el);
        
        void el.offsetWidth; 

        appendTransition(el,`box-shadow ${duration}ms ease`);

        const newShadow: string[] = originalShadow.split(') ');
        const shadowProp: string[] = newShadow[1]?.split(' ') || [''];

        /* 
            shadowProp[0] = x;
            shadowProp[1] = y;
            shadowProp[2] = intensity;
        */

        if (shadowProp[0]?.includes('-') && shadowProp[1]?.includes('-')) {
            requestAnimationFrame(() => {
                el.style.boxShadow = `4px 4px ${shadowProp[2]} ${newShadow[0]})`;
            });
        } else if ((!shadowProp[0]?.includes('-') && !shadowProp[1]?.includes('-')) && (shadowProp[0] !== '0px' && shadowProp[1] !== '0px')) {
            requestAnimationFrame(() => {
                el.style.boxShadow = `-4px -4px ${shadowProp[2]} ${newShadow[0]})`;
            });
        } else if ((!shadowProp[0]?.includes('-') && shadowProp[1]?.includes('-')) && shadowProp[0] !== '0px') {
            requestAnimationFrame(() => {
                el.style.boxShadow = `-4px 4px ${shadowProp[2]} ${newShadow[0]})`;
            });
        } else if ((shadowProp[0]?.includes('-') && !shadowProp[1]?.includes('-')) && shadowProp[1] !== '0px') {
            requestAnimationFrame(() => {
                el.style.boxShadow = `4px -4px ${shadowProp[2]} ${newShadow[0]})`;
            });
        }

        if (shadowProp[0] === '0px' && shadowProp[1]?.includes('-')) {
            requestAnimationFrame(() => {
                el.style.boxShadow = `0px 4px ${shadowProp[2]} ${newShadow[0]})`;
            });
        } else if (shadowProp[0] === '0px' && !shadowProp[1]?.includes('-')) {
            requestAnimationFrame(() => {
                el.style.boxShadow = `0px -4px ${shadowProp[2]} ${newShadow[0]})`;
            });
        } else if (!shadowProp[0]?.includes('-') && shadowProp[1] === '0px') {
            requestAnimationFrame(() => {
                el.style.boxShadow = `4px 0px ${shadowProp[2]} ${newShadow[0]})`;
            });
        } else if (shadowProp[0]?.includes('-') && shadowProp[1] === '0px') {
            requestAnimationFrame(() => {
                el.style.boxShadow = `-4px 0px ${shadowProp[2]} ${newShadow[0]})`;
            });
        }
    }

}