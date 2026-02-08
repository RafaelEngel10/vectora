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
  | "SEMICOLON";


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
    if (/\s/.test(char)) {
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


    if (/\d/.test(char)) {
      let value = "";

      // Continua lendo enquanto for número
      while (/\d/.test(input[i])) {
        value += input[i];
        i++;
      }

      tokens.push({ type: "NUMBER", value });
      continue;
    }

    if (/[a-zA-Z_.#]/.test(char)) {
      let value = "";

      // Permite letras, números, ponto, underscore e #
      while (/[a-zA-Z0-9_.#]/.test(input[i])) {
        value += input[i];
        i++;
      }

      // Detecta unidade de tempo
      if (value === "ms" || value === "s") {
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