import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties  } from '../../../basics.js';

export const gapAnimations = {
    bloom: (el: any, args: any) => {
        return new Promise<void>((resolve) => {
            const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
            const finalGap: number = parseFloat(parts[0] || '5');
            const duration: number = toMs(parts[1] || '600ms');
    
            ensureInlineBlockIfNeeded(el);
            el.style.transition = 'none';
            void el.offsetWidth; 

            const onEnd = (e: TransitionEvent) => {
                if (e.propertyName !== 'gap') return;
                el.removeEventListener('transitionend', onEnd);
                resolve();
            };

            el.addEventListener('transitionend', onEnd, { once: true });
    
            const initialGap = getComputedStyle(el).gap;
            if (!initialGap) el.style.gap = `0px`;
            else el.style.gap = `${initialGap}`;
    
            el.style.transition = `gap ${duration}ms ease`;
    
            requestAnimationFrame(() => {
                el.style.gap = `${finalGap}px`;
            });

            setTimeout(resolve, duration + 50);
        });
    },


    stagedBloom: (el: any, args: any) => {
        return new Promise<void>((resolve) => {
            const parts: any = args ? args.split(',').map((p: any) => p.trim()) : [];
            const direction: string = parts[0] || 'row';
            const intensity: number = parseFloat(parts[1] || '5');
            const duration: number = toMs(parts[1] || '600ms');
    
            ensureInlineBlockIfNeeded(el);
            el.style.transition = 'none';
            void el.offsetWidth; 
            
            const onEnd = (e: TransitionEvent) => {
                if (e.propertyName !== 'gap') return;
                el.removeEventListener('transitionend', onEnd);
                resolve();
            };

            el.addEventListener('transitionend', onEnd, { once: true });

            el.style.rowGap = `0px`;
            el.style.columnGap = `0px`;
    
            if (direction === 'row') {
                el.style.transition = `row-gap ${duration}ms ease`;
    
                requestAnimationFrame(() => {
                    el.style.rowGap = `${intensity}px`;
                }); 
    
                el.style.transition = `column-gap ${duration}ms ease`;
    
                requestAnimationFrame(() => {
                    el.style.columnGap = `${intensity}px`;
                });
                
            } else {
                el.style.transition = `column-gap ${duration}ms ease`;
    
                requestAnimationFrame(() => {
                    el.style.columnGap = `${intensity}px`;
                });
    
                el.style.transition = `row-gap ${duration}ms ease`;
    
                requestAnimationFrame(() => {
                    el.style.rowGap = `${intensity}px`;
                });
            }

            setTimeout(resolve, duration + 50);
        });
    }
}