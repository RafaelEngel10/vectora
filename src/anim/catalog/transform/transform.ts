import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../../../basics.js';

export const transformAnimations = {
    // stay rotated
    rotate: (el: any, arg: any) => {
        const parts: any = arg ? arg.split(',').map((p: any) => p.trim()) : [];
        const way: any = parts[0] || 'clockwise';
        const degrees: number = parseFloat(parts[1]) || 180;
        let duration: any = parts[2] || '600ms';

        duration = toMs(duration);

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        const animationName = `rotateAnimation_${Date.now()}`;
        const finalRotation = way === 'counter-clock' ? -degrees : degrees;
        
        const keyframesCSS = `
        @keyframes ${animationName} {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(${finalRotation}deg); }
        }
        `;

        const styleTag: HTMLStyleElement = document.createElement('style');
        styleTag.textContent = keyframesCSS;
        document.head.appendChild(styleTag);

        appendTransition(el, `${animationName} ${duration}ms ease-in-out forwards`);

        // When animation ends, apply final transform inline so rotation persists,
        // then remove the generated <style> and the listener.
        const onAnimationEnd = () => {
        appendTransition(el, `rotate(${finalRotation}deg)`);
        // Clear animation property so element keeps the inline transform
            el.style.animation = '';
            if (styleTag.parentNode) styleTag.remove();
            el.removeEventListener('animationend', onAnimationEnd);
        };

        el.addEventListener('animationend', onAnimationEnd);

        // Fallback: if animationend doesn't fire for some reason, cleanup after a bit
        setTimeout(() => {
        if (document.body.contains(styleTag)) {
            appendTransition(el, `rotate(${finalRotation}deg)`);
            el.style.animation = '';
            styleTag.remove();
            el.removeEventListener('animationend', onAnimationEnd);
        }
        }, duration + 250);
    },


    zoomIn: (el: any, arg: any) => {
        const parts: any = arg ? arg.split(',').map((p: any) => p.trim()) : [];
        const intensity: number = parseFloat(parts[0]) || 1.2;
        let duration: any = parts[1] || '600ms';

        duration = toMs(duration);

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        appendTransition(el, `scale(0)`);
        appendTransition(el, `transform ${duration}ms ease`);

        requestAnimationFrame(() => {
            appendTransition(el, `scale(${intensity})`);
        });
    },

    
    zoomOut: (el: any, arg: any) => {
        const parts: any = arg ? arg.split(',').map((p: any) => p.trim()) : [];
        const intensity: number = parseFloat(parts[0]) || 1.2;
        let duration: any = parts[1] || '600ms';

        duration = toMs(duration);

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        appendTransition(el, `scale(0)`);
        appendTransition(el, `transform ${duration}ms ease`);

        requestAnimationFrame(() => {
            appendTransition(el, `scale(${intensity/2})`);
        });
    },


    mirror: (el: any, arg: any) => {
        const parts: any = arg ? arg.split(',').map((p: any) => p.trim()) : [];
        const intensity: number = parseFloat(parts[0]) || 1;
        let duration: any = parts[1] || '600ms';

        duration = toMs(duration);

        ensureInlineBlockIfNeeded(el);
        void el.offsetWidth; 

        appendTransition(el, `scale(0)`);
        appendTransition(el, `transform ${duration}ms ease`);

        requestAnimationFrame(() => {
            appendTransition(el, `scale(-${intensity})`);
        });
    },
}