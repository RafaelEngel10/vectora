import { CounterOperatorHandler } from "../../client/operator/counter/operatorPercentageCounter.js";
import { familyFilter } from "../../client/operator/interpolation/familyFilter.js";
import { tildeReverseHandler } from "../../client/operator/reverse/operatorTildeReverse.js";
import { testCounterCondition, extractCounterOperator } from "../../public/data/storageSearch.js";
import { macron } from "../../console.js";

export function OperatorFilter(el, actions) {

    const action = actions.split('(')[0];
    let animation = '';
    let arg = '';
    
    // teste de operador lógico SOMA/CONCAT (++)
    const firstOperatorFilter = actions.includes('++');
    if (firstOperatorFilter) {
        macron('log', `Executando resolutor para operador lógico SOMA/CONCATENAÇÃO (++).`);
        familyFilter(el, actions);
        return true;
    }

    // teste de operador lógico CONCAT INDUZIDA (+-)
    const filter = actions.includes('+-'); 
    if (filter) {
        macron('log', `Executando resolutor para operador lógico CONCATENAÇÃO INDUZIDA (+-).`);
        familyFilter(el, actions);
        return true;
    }

    // teste de operador lógico REVERSOR (~~)
    const secondOperatorFilter = action.includes('~');
    if (secondOperatorFilter) {
        macron('log', `Executando resolutor para operador lógico REVERSOR (~).`);
        tildeReverseHandler(el, actions);
        return true;
    }

    // teste de operador lógico CONTADOR (%%)
    const thirdOperatorFilter = actions.includes('%%');
    if (thirdOperatorFilter) {
        macron('log', `Executando resolutor para operador lógico CONTADOR (%%).`);

        animation = actions.split('(')[0];

        /*const result = CounterOperatorHandler(animation, actions);
        const cenario = testCounterCondition(localStorage.getItem('hash'), extractCounterOperator(actions));
        localStorage.removeItem('hash');*/
        return true;
    }

    return false;
}