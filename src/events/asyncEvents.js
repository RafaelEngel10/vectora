import { runActionOnElements } from "../app/runActionOnElements.js";
import { mapEventName } from "../basics.js";
import { console } from "../console.js";

export function AsyncEvents(selector, rawEventName, actions) {
    const parts = rawEventName.split('@')[1];
    let target = null, evt = rawEventName;
    if (parts.length === 2) {
      target = parts[0].trim();
      evt = parts[1].trim();
    }

    const jsEvent = evt.replace(/^on/i, '').toLowerCase();
    const handler = () => {
      for (const a of actions) {
        runActionOnElements(selector, a);
      }
    };

    // root async event
    if (rawEventName.toLowerCase() === 'root') {
      selector = ':root';
      const els = document.querySelectorAll(selector);
      if (!els.length) return console('warn', 'Falha ao criar as variáveis root...');

      const variables = Object.freeze(
        Object.fromEntries(
          Array.from(els).map((el, i) => [`var_${i}`, el])
        )
      );

      console('log', `${variables}`);
      return;
    }



    // attach to elements (delegation not implemented — attach individually)
    const els = document.querySelectorAll(selector);
    if (!els || els.length === 0) {
      console('log', `nenhum elemento encontrado para bind do evento: ${selector}, ${rawEventName}`);
      return;
    }
    const mapped = mapEventName(jsEvent);
    els.forEach(el => {
      el.addEventListener(mapped, handler);
    });

  console('log', 'AsyncEvents.js foi executado com sucesso!');
}