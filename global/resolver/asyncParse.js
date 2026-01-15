import { Warning } from "postcss";
import { removeComments } from "../../dist/basics";

export function parseAsyncElement(code) {
  code = removeComments(code);

  let i = 0;
  const n = code.length;
  const blocks = [];

  function skipWhitespace() {
    while (i < n && /\s/.test(code[i])) i++;
  }

  while (i < n) {
    skipWhitespace();
    if (i >= n) break;

    // -------- selector --------
    const selStart = i;
    while (i < n && code[i] !== "{") i++;
    if (i >= n) break;

    const rawSelector = code.slice(selStart, i).trim();
    
    // se NÃO começar com '@', ignora o bloco inteiro
    if (!rawSelector.startsWith("@")) {
        i++; // pula '{'
        let brace = 1;

        while (i < n && brace > 0) {
            if (code[i] === "{") brace++;
            else if (code[i] === "}") brace--;
            i++;
        }

        continue; // segue para o próximo bloco
    }

    const selector = rawSelector;
    i++; // skip '{'

    // -------- body bruto --------
    let brace = 1;
    const bodyStart = i;

    while (i < n && brace > 0) {
      if (code[i] === "{") brace++;
      else if (code[i] === "}") brace--;
      i++;
    }

    if (brace !== 0) {
      throw new Error(`Bloco não fechado para selector '${selector}'`);
    }

    const body = code.slice(bodyStart, i - 1);

    // -------- quebra em linhas --------
    const actions = body
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(line => ({ action: line }));

    blocks.push({ selector, actions });
  }

  return blocks;
}