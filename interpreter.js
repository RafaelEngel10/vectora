/* interpreter.js
   Runtime simples e resiliente para Vectora (.vec)
   - <link rel="stylesheet" href="... .vec"> fetch only (host server needed)
   - <script type="module" src="vectora/interpreter.js"> inline (without CORS)
   - support for event blocks:
    #id { window.onLoad { text: land(600ms); }; }
*/

import { removeComments, toMs, ensureInlineBlockIfNeeded, parseAnimString,  mapEventName, parseProperties } from "./dist/basics.js";
import { macron } from "./console.js";
import { parseVectora, processVectora } from "./parse.js";

(function () {
  'use strict';


  /********** loader: link[href$=".vec"] fetch (server) + inline <script type="modules"> fallback **********/
  async function loadAll() {
    // before: inline scripts
    document.querySelectorAll('script[type="modules"]').forEach(s => {
      try {
        processVectora(s.textContent || s.innerText || '');
      } catch (e) {
        macron('error', `Erro no inline do .vec ${err}`);
      }
    });

    // after: links .vec
    const links = Array.from(document.querySelectorAll('link[rel="vectora"][href$=".vec"]'));
    macron('info', `carregando ${links.length} arquivos .vec via fetch()`);
    for (const link of links) {
      const href = link.getAttribute('href');
      try {
        // resolve relative to page
        const base = new URL(href, location.href).href;
        const res = await fetch(base);
        if (!res.ok) {
          macron('warn', `fetch .vec não ok ${res.status}, ${href}`)
          continue;
        }
        const text = await res.text();
        processVectora(text);
      } catch (err) {
        macron('error', `falha ao carregar .vec (CORS ou caminho): ${href}/${err}`);
      }
    }
  }

  // inicializa assim que o DOM estiver pronto (e garante execução se já carregado)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }

  // expõe para debug
  window.VectoraRuntime = { parseVectora, processVectora, loadAll };
})();


