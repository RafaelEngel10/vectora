import { append } from 'express/lib/response.js';
import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties, appendTransition  } from '../../../../../basics.js';

export const reverse = {
   fall: (el: HTMLElement, arg: string) => {
      return new Promise<void>((resolve) => {
       const duration: number = toMs(arg) || 600;
      
       ensureInlineBlockIfNeeded(el);
        
       el.style.transform = 'translateY(0px)';
       el.style.opacity = '1';
      
       void el.offsetWidth;
      
       appendTransition(el, `transform ${duration}ms ease, opacity ${duration}ms ease`);
       let finished = false;

       const finish = () => {
         if (finished) return;
         finished = true;
         el.removeEventListener('transitionend', onEnd);
         resolve();
       };

       const onEnd = (e: TransitionEvent) => {
         if (e.propertyName === 'opacity') {
           finish();
         }
       };

       el.addEventListener('transitionend', onEnd);
      
       requestAnimationFrame(() => {
          el.style.transform = 'translateY(-30px)';
          el.style.opacity = '0';
       });
   
       setTimeout(resolve, duration + 50);
      }) 
   },

   hook: (el: HTMLElement, arg: string) => {
      return new Promise<void>((resolve) => {
         const duration: number = toMs(arg) || 600;

         ensureInlineBlockIfNeeded(el);

         el.style.transform = `translateY(0px)`;
         el.style.opacity = '1';

         void el.offsetWidth;
         
         appendTransition(el, `transform ${duration}ms ease, opacity ${duration}ms ease`);

         let finished = false;

         const finish = () => {
         if (finished) return;
         finished = true;
         el.removeEventListener('transitionend', onEnd);
         resolve();
         };

         const onEnd = (e: TransitionEvent) => {
         if (e.propertyName === 'opacity') {
            finish();
         }
         };

         el.addEventListener('transitionend', onEnd);

         requestAnimationFrame(() => {
            el.style.transform = `translateY(-30px)`;
            el.style.opacity = '0';
         });

         setTimeout(resolve, duration + 50);
      })
   },
};