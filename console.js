export function macron(type, message) {
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
        case 'dir':
            console.dir('[Vectora]', message, { depth: null });
            break;
        case 'info':
            console.info('[Vectora]', message);
            break;
        default:
            console.error('[Vectora] Escolha um tipo de mensagem válido.');
            break;
    }
}