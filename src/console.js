export function console(type, message) {
    switch (type) {
        case 'debug':
            console.debug('[Vectora]', message);
            break;
        case 'warn':
            console.warn('[Vectora]', message);
            break;
        case 'error':
            console.error('[Vectora]', message);
            break;
        case 'log':
            console.log('[Vectora]', message);
            break;
    }
}