import { appendTransition, ensureInlineBlockIfNeeded, toMs } from "../extras/basics.js";
import { textAnimations } from "../catalog/text/textAnimations.js";
import { colorAnimations } from "../catalog/color/colorAnimations.js";
import { transformAnimations } from "../catalog/transform/transform.js";

const fadeOut = textAnimations.fadeOut;
const fadeIn = textAnimations.fadeIn;
const slideIn = textAnimations.slideIn; 
const slideOut = textAnimations.slideOut;
const pop = textAnimations.pop;
const implode = textAnimations.implode;
const octopus = colorAnimations.octopusCamo;
const chameleon = colorAnimations.chameleonCamo;
const zoomIn = transformAnimations.zoomIn;
const zoomOut = transformAnimations.zoomOut;

export function reverseAnimation(anim: any) {
    anim = anim.split('~')[1];
    if (anim == 'land') return reverseCatalog.fall;
    if (anim == 'rise') return reverseCatalog.hook;
    if (anim == 'fadeIn') return fadeOut;
    if (anim == 'fadeOut') return fadeIn;
    if (anim == 'slideIn') return slideOut;
    if (anim == 'slideOut') return slideIn;
    if (anim == 'pop') return implode;
    if (anim == 'implode') return pop;
    if (anim == 'octopusCamo') return chameleon;
    if (anim == 'chameleonCamo') return octopus;
    if (anim == 'zoomOut') return zoomIn;
    if (anim == 'zoomIn') return zoomOut;
}

export const reverseCatalog = {
    fall: (el: HTMLElement, args: any) => {
        return new Promise<void>(resolve => {
            const duration: number = toMs(args) || 600;

            ensureInlineBlockIfNeeded(el);

            el.style.transform = `translateY(0px)`;
            el.style.opacity = '1';
            void el.offsetWidth;

            appendTransition(el, `transform ${duration}ms ease, opacity ${duration}ms ease`);

            const onEnd = () => {
                el.removeEventListener('transitionend', onEnd);
                resolve();
            };
            el.addEventListener('transitionend', onEnd);

            requestAnimationFrame(() => {
                el.style.transform = 'translateY(30px)';
                el.style.opacity = '0';
            });
        });
    },
    hook: (el: HTMLElement, args: any) => {
        return new Promise<void>(resolve => {
            const duration = toMs(args) || 600;
            ensureInlineBlockIfNeeded(el);

            el.style.transform = `translateY(0px)`;
            el.style.opacity = `1`;
            void el.offsetWidth;

            appendTransition(el, `transform ${duration}ms ease, opacity ${duration}ms ease`);

            const onEnd = () => {
                el.removeEventListener('transitionend', onEnd);
                resolve();
            };
            el.addEventListener('transitionend', onEnd);

            requestAnimationFrame(() => {
                el.style.transform = `translateY(-30px)`;
                el.style.opacity = '0';
            });
        });
    },
}