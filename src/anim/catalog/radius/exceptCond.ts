export function execptCond(el: any, duration: number, round: number, specific: string): void {
    const parts = specific.split('pt-')[1];

    switch (parts) {
        case 'top-right':
            el.style.transition = 
                `border-top-left ${duration}ms, border-bottom-left ${duration}ms , border-bottom-right ${duration}ms`;
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        case 'top-left':
            el.style.transition = 
                `border-top-right ${duration}ms, border-bottom-left ${duration}ms , border-bottom-right ${duration}ms`;
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderBottomRightRadius = `${round}px`;
                el.style.borderTopRightRadius = `${round}px`;
            });
            break;
        case 'bottom-right':
            el.style.transition = 
                `border-top-left ${duration}ms, border-bottom-left ${duration}ms , border-top-right ${duration}ms`;
            requestAnimationFrame(() => {
                el.style.borderBottomLeftRadius = `${round}px`;
                el.style.borderTopRightRadius = `${round}px`;
                el.style.borderTopLeftRadius = `${round}px`;
            });
            break;
        case 'bottom-left':
            el.style.transition = 
                `border-top-left ${duration}ms, border-top-right ${duration}ms , border-bottom-right ${duration}ms`;
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