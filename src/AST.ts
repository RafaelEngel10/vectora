import { Token, TokenType, lexer } from "./lexer";
import { AnimationName } from "./catalog/text/textAnimations";

// AST raiz
interface ProgramNode {
  type: "Program";
  rules: RuleNode[];
}

interface RuleNode {
  type: "Rule";
  selector: string;
  triggers: TriggerNode[];
}

interface TriggerNode {
  type: "Trigger";
  name: string;
  statements: StatementNode[];
}

interface StatementNode {
  type: "Statement";
  property: string;
  action: ActionNode;
}

type ActionNode = {
  type: "Action";
  name: AnimationName;
  args: (string | number)[];
};



export function parser(tokens: Token[]): ProgramNode {
  let i = 0;

  function current() {
    return tokens[i];
  }

  function consume(type: TokenType, errorMsg: string) {
    const token = tokens[i];

    if (!token || token.type !== type) {
      throw new Error(errorMsg);
    }

    i++;
    return token;
  } 
  function parseProgram(): ProgramNode {
    const rules: RuleNode[] = [];

    while (i < tokens.length) {
      rules.push(parseRule());
    }

    return {
      type: "Program",
      rules,
    };
  }
  function parseRule(): RuleNode {
    const selectorToken = consume(
      "IDENT",
      "Esperado seletor (h1, .class, #id)"
    );

    consume("LBRACE", "Esperado '{' após seletor");

    const triggers: TriggerNode[] = [];

    while (current().type !== "RBRACE") {
      triggers.push(parseTrigger());
    }

    consume("RBRACE", "Esperado '}' no fim da regra");

    return {
      type: "Rule",
      selector: selectorToken.value!,
      triggers,
    };
  }

  function parseTrigger(): TriggerNode {
    const nameToken = consume(
      "IDENT",
      "Esperado nome do trigger (ex: window.onLoad)"
    );

    consume("LBRACE", "Esperado '{' após trigger");

    const statements: StatementNode[] = [];

    while (current().type !== "RBRACE") {
      statements.push(parseStatement());
    }

    consume("RBRACE", "Esperado '}' no fim do trigger");
    consume("SEMICOLON", "Esperado ';' após bloco do trigger");

    return {
      type: "Trigger",
      name: nameToken.value!,
      statements,
    };
  }

  function parseStatement(): StatementNode {
    const propertyToken = consume(
      "IDENT",
      "Esperado nome da propriedade"
    );

    consume("COLON", "Esperado ':' após propriedade");

    const action = parseAction();

    consume("SEMICOLON", "Esperado ';' no fim da declaração");

    return {
      type: "Statement",
      property: propertyToken.value!,
      action,
    };
  }

  function parseAction(): ActionNode {
    const actionToken = consume(
      "IDENT",
      "Esperado nome da ação"
    );

    consume("LPAREN", "Esperado '(' após ação");

    const numberToken = consume(
      "NUMBER",
      "Esperado número de duração"
    );

    const unitToken = consume(
      "UNIT",
      "Esperado unidade de tempo (ms ou s)"
    );

    consume("RPAREN", "Esperado ')' após duração");

    return {
      type: "Action",
      name: actionToken.value as AnimationName,
      duration: Number(numberToken.value),
      unit: unitToken.value!,
    };
  }

  return parseProgram();
}
