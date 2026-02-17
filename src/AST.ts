import { Token, TokenType, lexer } from "./lexer.js";

// AST raiz
// nó principal
interface ProgramNode {
  type: "Program";
  rules: RuleNode[];
}

// nó de regra
interface RuleNode {
  type: "Rule";
  selector: string;
  triggers: TriggerNode[];
}

// nó de trigger
interface TriggerNode {
  type: "Trigger";
  name: string;
  statements: StatementNode[];
}

// nó de declaração
interface StatementNode {
  type: "Statement";
  property: string;
  action: ActionExpr;
}

// nó de ação
type ActionNode = {
  type: "Action";
  name: string;
  args: (string | number)[];
};

// nó de sequência de ações
type ActionSequenceNode = {
  type: "ActionSequence";
  parts: ActionNode[];
  operators: string[];
  finalActions?: ActionNode[] | undefined;
  delays?: (number | null)[]; // delays entre ações (em ms), null significa sem delay
  finalDelayMs?: number; // delay antes de executar ações finais
};

type ActionExpr = ActionNode | ActionSequenceNode | undefined;

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
      "Esperado seletor (tag, .class, #id)"
    );

    consume("LBRACE", "Esperado '{' após seletor");

    const triggers: TriggerNode[] = [];

    while (current() && current()!.type !== "RBRACE") {
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
      "Esperado nome do trigger event."
    );

    consume("LBRACE", "Esperado '{' após trigger");

    const statements: StatementNode[] = [];

    while (current() && current()!.type !== "RBRACE") {
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
      "Esperado nome de uma propriedade"
    );

    consume("COLON", "Esperado ':' após propriedade");

    // Parse a primeira ação
    const firstAction = parseAction();

    const parts: ActionNode[] = [firstAction];
    const operators: string[] = [];
    const delays: (number | null)[] = [];

    // Enquanto houver operadores (ex: '++'), consome e lê próxima ação
    while (current() && current()!.type === "OPERATOR") {
      const op = consume("OPERATOR", "Esperado operador").value!;
      operators.push(op);
      
      // Verifica se há um delay antes da próxima ação
      let delay: number | null = null;
      if (current() && current()!.type === "DELAY") {
        const delayToken = consume("DELAY", "Esperado delay").value!;
        // Parseia "1000ms" ou "1s" para millisegundos
        const match = delayToken.match(/^(\d+(?:\.\d+)?)(ms|s)$/);
        if (match && match[1]) {
          let value = parseFloat(match[1]);
          const unit = match[2] || "ms";
          delay = unit === "s" ? value * 1000 : value;
        }
      }
      delays.push(delay);
      
      const nextAction = parseAction();
      parts.push(nextAction);
    }

    const finalActions: ActionNode[] = [];
    let finalDelay: number | null = null;

    // Verifica se há múltiplos "=>" (manipulação de interpolação)
    while (current() && current()!.type === "ARROW") {
      consume("ARROW", "Esperado '=>'");
      
      // Se há delay logo após =>, parseá-lo
      if (current() && current()!.type === 'DELAY') {
        const delayToken = consume("DELAY", "Esperado delay").value!;
        const match = delayToken.match(/^(\d+(?:\.\d+)?)(ms|s)$/);
        if (match && match[1]) {
          let value = parseFloat(match[1]);
          const unit = match[2] || "ms";
          finalDelay = unit === "s" ? value * 1000 : value;
        }
      }
      // Se há uma ação final (diferente de ; DELAY)
      else if (current() && current()!.type !== "SEMICOLON" && current()!.type !== "DELAY") {
        finalActions.push(parseAction());
        
        // Verifica se há delay APÓS a ação final
        if (current() && current()!.type === "DELAY") {
          const delayToken = consume("DELAY", "Esperado delay").value!;
          const match = delayToken.match(/^(\d+(?:\.\d+)?)(ms|s)$/);
          if (match && match[1]) {
            let value = parseFloat(match[1]);
            const unit = match[2] || "ms";
            finalDelay = unit === "s" ? value * 1000 : value;
          }
        }
      }
      // gastei trinta minutos procurando o erro, e era pq tava faltando ISSO no final
      // mais que CU
      delays.push(finalDelay);  
    }

    consume("SEMICOLON", "Esperado ';' no fim da declaração");

    let actionExpr: ActionExpr;
    if (parts.length > 1) {
      const sequenceNode: ActionSequenceNode = { 
        type: "ActionSequence", 
        parts, 
        operators
      };
      if (delays.length > 0) {
        sequenceNode.delays = delays;
      }
      if (finalActions.length > 0) {
        sequenceNode.finalActions = finalActions;
        if (finalDelay !== null) {
          sequenceNode.finalDelayMs = finalDelay;
        }
      }
      actionExpr = sequenceNode;
    } else {
      actionExpr = parts[0] as ActionNode;
    }

    return {
      type: "Statement",
      property: propertyToken.value!,
      action: actionExpr,
    };
  }

  function parseAction(): ActionNode {
    // Verifica se há um operador unário (~, #) antes da ação
    let unaryOp = "";
    if (current() && current()!.type === "OPERATOR" && (current()!.value === "~" || current()!.value === "#")) {
      unaryOp = consume("OPERATOR", "Esperado operador").value!;
    }

    const actionToken = consume(
      "IDENT",
      "Esperado nome da ação"
    );

    const actionName = unaryOp + actionToken.value;

    consume("LPAREN", "Esperado '(' após ação");

    // aceita parênteses vazios: func()
    if (current() && current()!.type === "RPAREN") {
      consume("RPAREN", "Esperado ')' após argumentos");
      return {
        type: "Action",
        name: actionName,
        args: [],
      };
    }

    const args: (string | number)[] = [];

    // Lê o primeiro argumento (se houver)
    let argToken = current();
    if (argToken) {
      if (argToken.type === "NUMBER") {
        let value = Number(consume("NUMBER", "Esperado número").value);
        // Se o próximo token é uma unidade, concatena
        if (current() && current()!.type === "UNIT") {
          const unit = consume("UNIT", "Esperado unidade").value!;
          args.push(`${value}${unit}`);
        } else {
          args.push(value);
        }
      } else if (argToken.type === "IDENT") {
        args.push(consume("IDENT", "Esperado identificador").value!);
      }
    }

    // Lê argumentos adicionais separados por vírgula
    while (current() && current()!.type === "COMMA") {
      consume("COMMA", "Esperado ','");
      argToken = current();
      
      if (argToken) {
        if (argToken.type === "NUMBER") {
          let value = Number(consume("NUMBER", "Esperado número").value);
          // Se o próximo token é uma unidade, concatena
          if (current() && current()!.type === "UNIT") {
            const unit = consume("UNIT", "Esperado unidade").value!;
            args.push(`${value}${unit}`);
          } else {
            args.push(value);
          }
        } else if (argToken.type === "IDENT") {
          args.push(consume("IDENT", "Esperado identificador").value!);
        }
      }
    }

    consume("RPAREN", "Esperado ')' após argumentos");

    return {
      type: "Action",
      name: actionName,
      args,
    };
  }

  return parseProgram();
}
