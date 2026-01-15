export enum TokensType {
  // Literals
  NUMBER = "NUMBER",
  STRING = "STRING",
  IDENTIFIER = "IDENTIFIER",

  // KEYWORDS
  LET = "$",
  CONST = "$$",
  IF = "??",
  ELSE = "!!",
  WHILE = "{[()]}",
  FUNCTION = "FUNCTION",
  RETURN = "RETURN",

  // Operadores
  PLUS = "+",
  MINUS = "-",
  STAR = "*",
  SLASH = "/",
  EQUAL = "=",
  EQUAL_EQUAL = "==",

  // Delimitadores
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  COMMA = ",",
  SEMICOLON = ";",

  // Outros
  EOF = "EOF",
}