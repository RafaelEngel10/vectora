import { CounterOperatorHandler } from "../../private/client/operator/counter/operatorPercentageCounter.js";
import { familyFilter } from "../../private/client/operator/interpolation/familyFilter.js";
import { tildeReverseHandler } from "../../private/client/operator/reverse/operatorTildeReverse.js";
import { macron } from "../console.js";

let el = <h1></h1>;
let actions = `~~land(600)`;

OperatorFilter(actions);

export function OperatorFilter(el, actions) {

    const action = actions.split('(')[0];
    let animation = '';
    let arg = '';

    // teste de operador lógico REVERSOR (~~)
    const firstOperatorFilter = action.includes('~~');
    if (firstOperatorFilter) {
        macron('log', `Executando resolutor para operador lógico REVERSOR (~~).`);
        tildeReverseHandler(el, actions);
    }


    const secondOperatorFilter = action.includes('++');
    if (secondOperatorFilter) {
        macron('log', `Executando resolutor para operador lógico SOMA/CONCATENAÇÃO (++).`);
        familyFilter(el, actions);
    }


    
    const thirdOperatorFilter = action.includes('%%');
    if (thirdOperatorFilter) {
        macron('log', `Executando resolutor para operador lógico CONTADOR (%%).`);
        CounterOperatorHandler();
    }
}