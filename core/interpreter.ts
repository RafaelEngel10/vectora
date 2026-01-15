import * as AST from "./AST.js";
import { Environment } from "./environment.js";
import { TokensType } from "./tokens/tokens.js";
import { Print } from "./native/bultins.js";

export class Interpreter {
  private environment = new Environment();

  interpret(statements: AST.Stmt[]): void {
    try {
      for (const stmt of statements) {
        this.execute(stmt);
      }
    } catch (err) {
      console.error("Erro em runtime:", err);
    }
  }

  // ---------------- statements ----------------

  private execute(stmt: AST.Stmt): void {
    switch (stmt.kind) {
      case "LetStmt":
        return this.executeLet(stmt);
      case "IfStmt":
        return this.executeIf(stmt);
      case "BlockStmt":
        return this.executeBlock(stmt);
      case "ExprStmt":
        this.evaluate(stmt.expression);
        return;
    }
  }

  private executeLet(stmt: AST.LetStmt): void {
    const value = this.evaluate(stmt.initializer);
    this.environment.define(stmt.name.lexeme, value);
  }

  private executeIf(stmt: AST.IfStmt): void {
    const condition = this.evaluate(stmt.condition);

    if (this.isTruthy(condition)) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch) {
      this.execute(stmt.elseBranch);
    }
  }

  private executeBlock(stmt: AST.BlockStmt): void {
    const previous = this.environment;
    this.environment = new Environment(previous);

    try {
      for (const s of stmt.statements) {
        this.execute(s);
      }
    } finally {
      this.environment = previous;
    }
  }

  // ---------------- expressions ----------------

  private evaluate(expr: AST.Expr): any {
    switch (expr.kind) {
      case "LiteralExpr":
        return expr.value;

      case "VariableExpr":
        return this.environment.get(expr.name.lexeme);

      case "GroupingExpr":
        return this.evaluate(expr.expression);

      case "UnaryExpr":
        return this.evaluateUnary(expr);

      case "BinaryExpr":
        return this.evaluateBinary(expr);
    }
  }

  private evaluateUnary(expr: AST.UnaryExpr): any {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokensType.MINUS:
        this.checkNumberOperand(expr.operator.lexeme, right);
        return -Number(right);
    }

    throw new Error("Operador unário inválido");
  }

  private evaluateBinary(expr: AST.BinaryExpr): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokensType.PLUS:
        return left + right;

      case TokensType.MINUS:
        this.checkNumberOperands(expr.operator.lexeme, left, right);
        return left - right;

      case TokensType.STAR:
        this.checkNumberOperands(expr.operator.lexeme, left, right);
        return left * right;

      case TokensType.SLASH:
        this.checkNumberOperands(expr.operator.lexeme, left, right);
        return left / right;

      case TokensType.EQUAL_EQUAL:
        return left === right;
    }

    throw new Error("Operador binário inválido");
  }

  // ---------------- helpers ----------------

  private isTruthy(value: any): boolean {
    return value !== false && value !== null && value !== undefined;
  }

  private checkNumberOperand(operator: string, value: any): void {
    if (typeof value === "number") return;
    throw new Error(`Operador '${operator}' espera número`);
  }

  private checkNumberOperands(operator: string, left: any, right: any): void {
    if (typeof left === "number" && typeof right === "number") return;
    throw new Error(`Operador '${operator}' espera números`);
  }

  // ---------------- native-functions ----------------

  constructor() {
    this.environment.define("print", new Print());
  }
}
