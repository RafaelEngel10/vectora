import { runActionOnElements } from "../../src/app/runActionOnElements.js";
import { mapEventName } from "../../dist/basics.js";
import { macron }from "../../console.js";

export function AsyncEvents(selector, rawEventName, actions) {
  macron('info', `executando AsyncEvents: ${selector}, ${rawEventName}, ${actions}`);


  // import async event
  if (rawEventName.toLowerCase() === 'import') {
    
  }
 
  // root async event
  if (rawEventName.toLowerCase() === 'root') {
    selector = ':root';
    const els = document.querySelectorAll(selector);
    if (!els.length) return macron('warn', 'Falha ao criar as variáveis root...');
    const variables = Object.freeze(
      Object.fromEntries(
        Array.from(els).map((el, actions) => [`var_${actions}`, el])
      )
    );
    macron('log', `${variables}`);
    return;
  }

  macron('log', 'AsyncEvents.js foi executado com sucesso!');
}