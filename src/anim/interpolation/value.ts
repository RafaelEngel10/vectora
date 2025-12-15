import { animFilter } from "./filter";
import { typeFilter } from "./ppFilter";
import { induceConcat } from "./concatenation/induce/induce";

export function valueFilter(type: string, animState: string[]): void {
    const firstPart: string = animState[0] || '';
    const secondPart: string = animState[1] || '';

    if (type === 'INTERPOL') {
        
        if (firstPart.includes('++')) {
            const newFirstPart = animFilter(firstPart);
            valueFilter(newFirstPart.type, newFirstPart.parts);
        } else {
            const newFirstPart = animFilter(firstPart);
            valueFilter(newFirstPart.type, newFirstPart.parts);
        }

    } else if (type === 'SUM/CONCAT') {


    } else if (type === 'INDUCE') {
        if (animState.length < 2) return;
        induceConcat(animState);
    } else {
        console.warn(`[Vectora] Erro de filtro nos valores, valor indefinido: ${type}`);
        return;
    }
}   