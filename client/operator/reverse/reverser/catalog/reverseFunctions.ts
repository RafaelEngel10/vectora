import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../../../../../basics.js';

export const reverse = {
    fall: (el: HTMLElement, arg: string) => {
       return new Promise<void>((resolve) => {
        const duration: number = toMs(arg);
       
        ensureInlineBlockIfNeeded(el);
         
        appendTransition(el, `transform ${duration}ms ease`);
        el.style.transform = 'translateY(0px)';
        el.style.opacity = '1';
       
        void el.offsetWidth;
       
        el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
       
        requestAnimationFrame(() => {
           el.style.transform = 'translateY(-30px)';
           el.style.opacity = '0';
        });
    
        setTimeout(resolve, duration + 50);
      }) 
    },
};