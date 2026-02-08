import { lexer } from "./lexer";
import { parser } from "./AST";
import { interpret } from "./interpreter";

async function loadLickFiles() {
  // find all vectora link
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="vectora"]');

  for (const link of links) {
    const response = await fetch(link.href);

    if (!response.ok) {
      throw new Error(`-Vectora -> Erro ao carregar o arquivo ${link.href}`);
    }

    const source = await response.text();

    // Pipeline completo
    const tokens = lexer(source);
    const ast = parser(tokens);
    interpret(ast);
  }
}

// executes after DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadLickFiles);