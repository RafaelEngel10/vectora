import { Lexer } from "../dist/core/lexer.js";
import { Parser } from "../dist/core/parser.js";
import { Interpreter } from "../dist/core/interpreter.js";
import { readTxtFile } from "../private/admin/reader.js";

const source = readTxtFile('./private/in/instructor.txt');
console.log(source);

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter();
interpreter.interpret(ast);