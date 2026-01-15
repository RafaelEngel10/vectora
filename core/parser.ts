import { Token } from "./tokens/token.js";
import { TokensType } from "./tokens/tokens.js";
import * as AST from "./AST.js";

export class Parser {
  private current = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): AST.Stmt[] {
    const statements: AST.Stmt[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }

    return statements;
  }

  // ---------------- statements ----------------

  private statement(): AST.Stmt {
    if (this.match(TokensType.LET)) return this.letStatement();
    if (this.match(TokensType.IF)) return this.ifStatement();
    if (this.match(TokensType.LBRACE)) return this.block();

    return this.expressionStatement();
  }

  private letStatement(): AST.LetStmt {
    const name = this.consume(
      TokensType.IDENTIFIER,
      "Esperado nome da variável após $"
    );

    this.consume(TokensType.EQUAL, "Esperado '=' após nome da variável");

    const initializer = this.expression();

    this.consume(TokensType.SEMICOLON, "Esperado ';' após declaração");

    return {
      kind: "LetStmt",
      name,
      initializer,
    };
  }

  private ifStatement(): AST.IfStmt {
    this.consume(TokensType.LPAREN, "Esperado '(' após ??");

    const condition = this.expression();

    this.consume(TokensType.RPAREN, "Esperado ')' após condição");

    const thenBranch = this.statement();

    const ifStmt: AST.IfStmt = {
      kind: "IfStmt",
      condition,
      thenBranch,
    };

    if (this.match(TokensType.ELSE)) {
      ifStmt.elseBranch = this.statement();
    }

    return ifStmt;
  }

  private block(): AST.BlockStmt {
    const statements: AST.Stmt[] = [];

    while (!this.check(TokensType.RBRACE) && !this.isAtEnd()) {
      statements.push(this.statement());
    }

    this.consume(TokensType.RBRACE, "Esperado '}' após bloco");

    return {
      kind: "BlockStmt",
      statements,
    };
  }

  private expressionStatement(): AST.ExprStmt {
    const expr = this.expression();
    this.consume(TokensType.SEMICOLON, "Esperado ';' após expressão");

    return {
      kind: "ExprStmt",
      expression: expr,
    };
  }

  // ---------------- expressions ----------------

  private expression(): AST.Expr {
    return this.equality();
  }

  private equality(): AST.Expr {
    let expr = this.comparison();

    while (this.match(TokensType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = {
        kind: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }

    return expr;
  }

  private comparison(): AST.Expr {
    return this.term();
  }

  private term(): AST.Expr {
    let expr = this.factor();

    while (this.match(TokensType.PLUS, TokensType.MINUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = {
        kind: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }

    return expr;
  }

  private factor(): AST.Expr {
    let expr = this.unary();

    while (this.match(TokensType.STAR, TokensType.SLASH)) {
      const operator = this.previous();
      const right = this.unary();
      expr = {
        kind: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }

    return expr;
  }

  private unary(): AST.Expr {
    if (this.match(TokensType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return {
        kind: "UnaryExpr",
        operator,
        right,
      };
    }

    return this.primary();
  }

  private primary(): AST.Expr {

    if (this.match(TokensType.NUMBER, TokensType.STRING)) {
      return {
        kind: "LiteralExpr",
        value: this.previous().lexeme,
      };
    }

    if (this.match(TokensType.IDENTIFIER)) {
      return {
        kind: "VariableExpr",
        name: this.previous(),
      };
    }

    if (this.match(TokensType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokensType.RPAREN, "Esperado ')' após expressão");
      return {
        kind: "GroupingExpr",
        expression: expr,
      };
    }

    throw this.error(this.peek(), "Expressão esperada");
  }

  // ---------------- helpers ----------------

  private match(...types: TokensType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokensType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  private check(type: TokensType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokensType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current]!;
  }

  private previous(): Token {
    return this.tokens[this.current - 1]!;
  }

  private error(token: Token, message: string): Error {
    return new Error(
      `[linha ${token.line}] Erro em '${token.lexeme}': ${message}`
    );
  }
}