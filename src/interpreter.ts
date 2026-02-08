import { triggerEvents } from "./events/triggerEvents";
import { filterAnim } from "./filter/filterAnim";

// Tipagem mínima baseada no AST que você já tem
type ProgramNode = {
  type: "Program";
  rules: RuleNode[];
};

type RuleNode = {
  type: "Rule";
  selector: string;
  triggers: TriggerNode[];
};

type TriggerNode = {
  type: "Trigger";
  name: string;
  statements: StatementNode[];
};

type StatementNode = {
  type: "Statement";
  property: string;
  action: ActionExpr;
};

type ActionNode = {
  type: "Action";
  name: string;
  args: (string | number)[];
};

type ActionSequenceNode = {
  type: "ActionSequence";
  parts: ActionNode[];
  operators: string[];
};

type ActionExpr = ActionNode | ActionSequenceNode;

// registra o trigger 
const triggerRegistry: Record<string, (cb: (targets?: HTMLElement[]) => any, elements: NodeListOf<HTMLElement>) => void> = triggerEvents;

// animations are selected dynamically via `filterAnim` based on action name

export function interpret(ast: ProgramNode) {
  console.log("[Vectora] Iniciando interpretação de", ast.rules.length, "regra(s)");
  
  // Percorre cada regra da DSL
  for (const rule of ast.rules) {
    console.log("[Vectora] Processando regra com seletor:", rule.selector);

    // Resolve o seletor CSS
    const elements = document.querySelectorAll<HTMLElement>(rule.selector);

    if (elements.length === 0) {
      console.warn(`[Vectora] Nenhum elemento encontrado para: ${rule.selector}`);
      continue;
    }
    
    console.log(`[Vectora] ${elements.length} elemento(s) encontrado(s) para "${rule.selector}"`);

    // Cada regra pode ter vários triggers
    for (const trigger of rule.triggers) {
      console.log("[Vectora] Registrando trigger:", trigger.name);

      const triggerFn = triggerRegistry[trigger.name];

      if (!triggerFn) {
        throw new Error(`[Vectora] Trigger não suportado: ${trigger.name}`);
      }

      // Registra o trigger; o callback pode receber um array opcional de elementos-alvo
      triggerFn(async (targets?: HTMLElement[]) => {
        console.log("[Vectora] Trigger disparado:", trigger.name);

        const runElements = targets && targets.length ? targets : Array.from(elements);

        // Quando o trigger dispara, executa as statements apenas nos elementos alvo
        for (const element of runElements) {
          // Executar cada statement em paralelo (cada statement pode conter uma sequência interna)
          const statementPromises: Promise<any>[] = [];

          for (const statement of trigger.statements) {
            const actionExpr = statement.action;

            if ((actionExpr as any).type === "Action") {
              const action = actionExpr as any as { type: string; name: string; args: (string | number)[] };
              statementPromises.push((async () => {
                const animations = filterAnim(action.name as string);
                const animationFn = (animations as any)[action.name as any];
                const argsStr = action.args.join(",");

                console.log("[Vectora] Executando animação:", action.name, "com argumentos:", argsStr);

                if (!animationFn) throw new Error(`[Vectora] Animação não encontrada: ${action.name}`);

                // Pode retornar uma Promise ou não; normalizamos com Promise.resolve
                return await Promise.resolve(animationFn(element, argsStr));
              })());
            } else if ((actionExpr as any).type === "ActionSequence") {
              const seq = actionExpr as any as { type: string; parts: any[]; operators: string[] };
              // Cada sequência deve rodar de forma sequencial, mas a sequência inteira pode rodar em paralelo com outras statements
              statementPromises.push((async () => {
                for (let idx = 0; idx < seq.parts.length; idx++) {
                  const part = seq.parts[idx];
                  const animationsForPart = filterAnim(part.name as string);
                  const animationFn = (animationsForPart as any)[part.name as any];
                  const argsStr = part.args.join(",");
                  console.log("[Vectora] Executando concatenação de animação:", part.name, "com argumentos:", argsStr);
                  if (!animationFn) throw new Error(`[Vectora] Animação não encontrada: ${part.name}`);
                  await Promise.resolve(animationFn(element, argsStr));
                }
              })());
            }
          }

          // Aguarda todas as statements (cada uma já trata sequências internamente)
          await Promise.all(statementPromises);
        }
      }, elements);
    }
  }
}