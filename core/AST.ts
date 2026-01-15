import { Token } from "./tokens/token.js";

export type Stmt =
  | LetStmt
  | IfStmt
  | BlockStmt
  | ExprStmt;

export type Expr =
  | BinaryExpr
  | UnaryExpr
  | LiteralExpr
  | VariableExpr
  | GroupingExpr;

export interface LetStmt {
  kind: "LetStmt";
  name: Token;
  initializer: Expr;
}

export interface IfStmt {
  kind: "IfStmt";
  condition: Expr;
  thenBranch: Stmt;
  elseBranch?: Stmt;
}

export interface BlockStmt {
  kind: "BlockStmt";
  statements: Stmt[];
}

export interface ExprStmt {
  kind: "ExprStmt";
  expression: Expr;
}

export interface BinaryExpr {
  kind: "BinaryExpr";
  left: Expr;
  operator: Token;
  right: Expr;
}

export interface UnaryExpr {
  kind: "UnaryExpr";
  operator: Token;
  right: Expr;
}

export interface LiteralExpr {
  kind: "LiteralExpr";
  value: any;
}

export interface VariableExpr {
  kind: "VariableExpr";
  name: Token;
}

export interface GroupingExpr {
  kind: "GroupingExpr";
  expression: Expr;
}

export interface CallExpr {
  kind: "CallExpr";
  callee: Expr;
  args: Expr[];
}