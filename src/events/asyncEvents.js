import { runActionOnElements } from "../app/runActionOnElements.js";
import { mapEventName } from "../../dist/basics.js";
import { macron }from "../console.js";

export function AsyncEvents(selector, rawEventName, actions) {
    macron('info', `executando AsyncEvents: ${selector}, ${rawEventName}, ${actions}`);
   
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

    // attach to elements (delegation not implemented — attach individually)
    const els = document.querySelectorAll(selector);
    if (!els || els.length === 0) {
      macron('log', `nenhum elemento encontrado para bind do evento: ${selector}, ${rawEventName}`);
      return;
    }
    
    els.forEach(el => {
      el.addEventListener(rawEventName, handler);
    });

  macron('log', 'AsyncEvents.js foi executado com sucesso!');
}