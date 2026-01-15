import { TokensType } from "./tokens/tokens.js";
import { Token } from "./tokens/token.js";

const KEYWORDS: Record<string, TokensType> = {
  let: TokensType.LET,
  const: TokensType.CONST,
  if: TokensType.IF,
  else: TokensType.ELSE,
  while: TokensType.WHILE,
  function: TokensType.FUNCTION,
  return: TokensType.RETURN,
};

export class Lexer {
  private pos = 0;
  private line = 1;
  private column = 1;

  constructor(private readonly source: string) {}

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isAtEnd()) {
      const token = this.nextToken();
      if (token) tokens.push(token);
    }

    tokens.push(new Token(TokensType.EOF, "", this.line, this.column));
    return tokens;
  }

  private nextToken(): Token | null {
    const char = this.advance();

    // Ignorar espaços
    if (char === " " || char === "\t" || char === "\r") return null;
    if (char === "\n") {
      this.line++;
      this.column = 1;
      return null;
    }

    // Números
    if (this.isDigit(char)) {
      return this.number();
    }

    // Identificadores / keywords
    if (this.isAlpha(char)) {
      return this.identifier();
    }

    // LET -> $
    if (char === "$") {
      return this.makeToken(TokensType.LET, "$");
    }

    if (char === "$$") {
      return this.makeToken(TokensType.CONST, "$$");
    }

    // IF -> ??
    if (char === "?" && this.match("?")) {
      return this.makeToken(TokensType.IF, "??");
    }

    // ELSE -> !!
    if (char === "!" && this.match("!")) {
      return this.makeToken(TokensType.ELSE, "!!");
    }

    // Strings
    if (char === '"') {
      return this.string();
    }

    // Operadores compostos
    if (char === "=" && this.match("=")) {
      return this.makeToken(TokensType.EQUAL_EQUAL, "==");
    }

    // Operadores simples / delimitadores
    switch (char) {
      case "+": return this.makeToken(TokensType.PLUS, char);
      case "-": return this.makeToken(TokensType.MINUS, char);
      case "*": return this.makeToken(TokensType.STAR, char);
      case "/": return this.makeToken(TokensType.SLASH, char);
      case "=": return this.makeToken(TokensType.EQUAL, char);
      case "(": return this.makeToken(TokensType.LPAREN, char);
      case ")": return this.makeToken(TokensType.RPAREN, char);
      case "{": return this.makeToken(TokensType.LBRACE, char);
      case "}": return this.makeToken(TokensType.RBRACE, char);
      case ";": return this.makeToken(TokensType.SEMICOLON, char);
      case ",": return this.makeToken(TokensType.COMMA, char);
    }

    throw new Error(`Caractere inesperado '${char}' na linha ${this.line}`);
  }

  private number(): Token {
    let value = this.peekPrev();

    while (this.isDigit(this.peek())) {
      value += this.advance();
    }

    return this.makeToken(TokensType.NUMBER, value);
  }

  private identifier(): Token {
    let value = this.peekPrev();

    while (this.isAlphaNumeric(this.peek())) {
      value += this.advance();
    }

    const type = KEYWORDS[value] ?? TokensType.IDENTIFIER;
    return this.makeToken(type, value);
  }

  private string(): Token {
    let value = "";

    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === "\n") this.line++;
      value += this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error("String não terminada");
    }

    this.advance(); // fecha aspas
    return this.makeToken(TokensType.STRING, value);
  }

  // ---------------- helpers ----------------

  private advance(): string {
    const char = this.source[this.pos++];
    this.column++;
    return char || '';
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.pos] !== expected) return false;
    this.pos++;
    this.column++;
    return true;
  }

  private peek(): string {
    return this.isAtEnd() ? "\0" : this.source[this.pos] || '';
  }

  private peekPrev(): string {
    return this.source[this.pos - 1] || '';
  }

  private isAtEnd(): boolean {
    return this.pos >= this.source.length;
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
      c === "_"
    );
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private makeToken(type: TokensType, lexeme: string): Token {
    return new Token(type, lexeme, this.line, this.column - lexeme.length);
  }
}