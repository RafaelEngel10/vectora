export function induceConcat(animParts: string[]): any {;
    if (!animParts || animParts.length < 2) {
        console.warn(`[Vectora] Erro na concatenação induzida, partes da animação ausentes.`);
        return { type: 'NONE', parts: [] };
    }

    return {
        type: 'NONE',
        parts: [animParts[0], animParts[1]]
    };
}