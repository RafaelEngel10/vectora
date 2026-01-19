import { runActionOnElements } from "../app/runActionOnElements.js";
import { mapEventName } from "../../basics.js";
import { macron }from "../console.js";

export function attachHandlerForEvent(selector, rawEventName, actions) {
    // rawEventName: ex "window.onLoad" or "reveal.onScroll"
    const parts = rawEventName.split('.');
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


    // onSing.click event listener
    if (rawEventName === 'onSing.click') {
      const els = document.querySelectorAll(selector);
      if (!els.length) return macron('error', 'Nenhum elemento para onSing.click!');

      els.forEach(el => {
        el.addEventListener('click', () => {
          for (const a of actions) {
            runActionOnElements(selector, a);
          }
          });
      });
      return;
    }


    // onDbl.click event listener
    if (rawEventName === 'onDbl.click') {
    const els = document.querySelectorAll(selector);
    if (!els.length) return macron('error', 'Nenhum elemento para onDbl.click!');

      els.forEach(el => {
        el.addEventListener('dblclick', () => {
          for (const a of actions) {
            runActionOnElements(selector, a);
          }
          });
        });
      return;
    }


    // onHold.click event listener
    if (rawEventName === 'onHold.click') {
      const els = document.querySelectorAll(selector);
      if (!els.length) return macron('error', `Nenhum elemento para ${rawEventName}`);
      els.style.userSelect = "none";

      const holdDuration = 150; // enough time to consider "hold" (ms).
      els.forEach(el => {
        let holdTimer;

        el.addEventListener('mousedown', () => {
          holdTimer = setTimeout(() => {
            for (const a of actions) {
              runActionOnElements(selector, a);
            }
          }, holdDuration);
        });

        el.addEventListener('mouseup', () => clearTimeout(holdTimer));
        el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
      });
      return;
    }


    // window.onLoad event listener
    if (target && target.toLowerCase() === 'window') {
      window.addEventListener(jsEvent, handler);
      if (jsEvent === 'load' && document.readyState === 'complete') {
        macron('log', `window already loaded — executing handler for ${selector}`);
        handler();
      }
      return;
    }


    // DOMContent.onLoad event listener
    if (rawEventName === 'DOMContent.onLoad') {
      const handler = () => {
        for (const a of actions) {
          runActionOnElements(selector, a);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handler);
      } else { handler(); }
      return;
    }
    

    // reveal.onScroll event listener
    if (rawEventName === 'reveal.onScroll') {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
          for (const a of actions) {
            runActionOnElements(selector, a);
          }
          // remove o observador após o primeiro disparo 
          obs.unobserve(entry.target);
        }
        });
      }, {
        threshold: 0.05 // 5% visível já ativa
      });

      const els = document.querySelectorAll(selector);
      els.forEach(el => observer.observe(el));

      macron('debug', `Ativado reveal.onScroll para ${selector}`)
      return;
    }


    // hide.onScroll event listener
    if (rawEventName === 'hide.onScroll') {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            for (const a of actions) {
              runActionOnElements(selector, a);
            }
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05
      });

      const els = document.querySelectorAll(selector);
      els.forEach(el => observer.observe(el));

      macron('debug', `Ativado hide.onScroll para ${selector}`);
      return;
    }



    // onSelection.click event listener
    if (rawEventName === 'onSelection.click') {
      let hasSelection = false;

      document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        hasSelection = selection && selection.toString().trim().length > 0;

        if (!hasSelection) return;

        for (const a of actions) {
          runActionOnElements(selector, a);
        }

        macron('debug', `Ativado onSelection.click para ${selector}`);
        hasSelection = false;
      });

      return;
    }


    
    // attach to elements (delegation not implemented — attach individually)
    const els = document.querySelectorAll(selector);
    if (!els || els.length === 0) {
      macron('log', `Nenhum elemento encontrado para bind do evento ${selector} e ${rawEventName}`);
      return;
    }
    const mapped = mapEventName(jsEvent);
    els.forEach(el => {
      el.addEventListener(mapped, handler);
    });
}