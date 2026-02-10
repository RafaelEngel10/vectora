import { lexer } from "./lexer";
import { parser } from "./AST";
import { interpret } from "./interpreter";

async function loadVectoraFiles() {
  // find all vectora link
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="vectora"]');

  for (const link of links) {
    console.log("[Vectora] Carregando arquivo Vectora:", link.href);
    const response = await fetch(link.href);

    if (!response.ok) {
      throw new Error(`[Vectora] Erro ao carregar o arquivo ${link.href}`);
    }

    const source = await response.text();
    console.log("[Vectora] Código carregado:", source);

    // Pipeline completo
    try {
      const tokens = lexer(source);
      console.log("[Vectora] Tokens gerados:", tokens);
      
      const ast = parser(tokens);
      console.log("[Vectora] AST gerada:", ast);
      
      interpret(ast);
      console.log("[Vectora] Interpretação completa!");
    } catch (error) {
      console.error("[Vectora] Erro no pipeline Vectora:", error);
      throw error;
    }
  }
}

// executes after DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadVectoraFiles);