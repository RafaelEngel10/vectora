import { TokensType } from "./tokens.js";

export class Token {
    constructor(
        public type: TokensType,
        public lexeme: string,
        public line: number,
        public column: number
  ) {}
}