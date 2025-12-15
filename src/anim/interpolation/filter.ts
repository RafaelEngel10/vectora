/**
 * Analisa uma string de ação para identificar o tipo de operação.
 * A precedência é: Concatenação (++) < Interpolação (=>)
 * @param {string} actionString - A string de animação, ex: "slideIn() ++ spin() => fadeOut();".
 * @returns {{type: 'CONCAT' | 'INTERPOL' | 'NONE', parts: string[]}}
 */
export function animFilter(actionString: any): any {

    if (actionString.includes('=>')) {
        return {
            type: 'INTERPOL',
            parts: actionString.split('=>').map((s: any) => s.trim())
        };
    }
    

    if (actionString.includes('++')) {
        return {
            type: 'SUM/CONCAT',
            parts: actionString.split('++').map((s: any) => s.trim())
        };
    }

    if (actionString.includes('+-')) {
        return {
            type: 'INDUCE',
            parts: actionString.split('+-').map((s: any) => s.trim())
        };
    }


    return {
        type: 'NONE',
        parts: [actionString.trim()]
    };
}