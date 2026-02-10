// Tipos de tokens possíveis na sua DSL
export type TokenType =
  | "IDENT"
  | "NUMBER"
  | "UNIT"
  | "LBRACE"
  | "RBRACE"
  | "LPAREN"
  | "RPAREN"
  | "COLON"
  | "SEMICOLON"
  | "COMMA"
  | "OPERATOR";


// Estrutura básica de um token
export interface Token {
  type: TokenType;
  value?: string;
}

export function lexer(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // Percorre o texto caractere por caractere
  while (i < input.length) {
    const char = input[i];

    // Ignora espaços, tabs e quebras de linha
    if (char && /\s/.test(char)) {
      i++;
      continue;
    }

     if (char === "{") {
      tokens.push({ type: "LBRACE" });
      i++;
      continue;
    }

    if (char === "}") {
      tokens.push({ type: "RBRACE" });
      i++;
      continue;
    }

    if (char === "(") {
      tokens.push({ type: "LPAREN" });
      i++;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "RPAREN" });
      i++;
      continue;
    }

    if (char === ":") {
      tokens.push({ type: "COLON" });
      i++;
      continue;
    }

    if (char === ";") {
      tokens.push({ type: "SEMICOLON" });
      i++;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "COMMA" });
      i++;
      continue;
    }

    // operadores '++' e '+-'
    if (char === "+") {
      const next = input[i + 1];
      if (next === "+") {
        tokens.push({ type: "OPERATOR", value: "++" });
        i += 2;
        continue;
      } else if (next === "-") {
        tokens.push({ type: "OPERATOR", value: "+-"});
        i += 2;
        continue;
      }
    }

    // operador de reversão '~'
    if (char === "~") {
      tokens.push({ type: "OPERATOR", value: "~"});
      continue;
    }

    if (char && /\d/.test(char)) {
      let value = "";

      // Continua lendo enquanto for número ou ponto (para decimais como 1.2)
      while (input[i] && /[\d.]/.test(input[i] as string)) {
        value += input[i];
        i++;
      }

      tokens.push({ type: "NUMBER", value });
      continue;
    }

    if (char && /[a-zA-Z_.#]/.test(char)) {
      let value = "";

      // Permite letras, números, ponto, underscore e #
      while (input[i] && /[a-zA-Z0-9_.#]/.test(input[i] as string)) {
        value += input[i];
        i++;
      }

      // Detecta unidade (tempo, tamanho, ângulo, etc)
      if (["ms", "s", "px", "%", "em", "rem", "vh", "vw", "pt", "cm", "mm", "in", "pc", "deg", "rad", "turn", "vh", "vw"].includes(value)) {
        tokens.push({ type: "UNIT", value });
      } else {
        tokens.push({ type: "IDENT", value });
      }

      continue;
    }

    throw new Error(`Caractere inesperado: '${char}'`);
  }

  return tokens;
}