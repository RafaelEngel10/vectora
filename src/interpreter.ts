import { textAnimations, AnimationName } from "./catalog/text/textAnimations";
import { triggerEvents } from "./events/triggerEvents";

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
  name: AnimationName;
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

let animations = textAnimations;

export function interpret(ast: ProgramNode) {
  console.log("🔍 Iniciando interpretação de", ast.rules.length, "regra(s)");
  
  // Percorre cada regra da DSL
  for (const rule of ast.rules) {
    console.log("📌 Processando regra com seletor:", rule.selector);

    // Resolve o seletor CSS
    const elements = document.querySelectorAll<HTMLElement>(rule.selector);

    if (elements.length === 0) {
      console.warn(`⚠️ Nenhum elemento encontrado para: ${rule.selector}`);
      continue;
    }
    
    console.log(`✅ ${elements.length} elemento(s) encontrado(s) para "${rule.selector}"`);

    // Cada regra pode ter vários triggers
    for (const trigger of rule.triggers) {
      console.log("🎯 Registrando trigger:", trigger.name);

      const triggerFn = triggerRegistry[trigger.name];

      if (!triggerFn) {
        throw new Error(`Trigger não suportado: ${trigger.name}`);
      }

      // Registra o trigger; o callback pode receber um array opcional de elementos-alvo
      triggerFn(async (targets?: HTMLElement[]) => {
        console.log("⚡ Trigger disparado:", trigger.name);

        const runElements = targets && targets.length ? targets : Array.from(elements);

        // Quando o trigger dispara, executa as statements apenas nos elementos alvo
        for (const element of runElements) {
          for (const statement of trigger.statements) {

            const actionExpr = statement.action;

            // Se for uma ação simples
            if ((actionExpr as any).type === "Action") {
              const action = actionExpr as any as { type: string; name: string; args: (string | number)[] };
              const animationFn = (animations as any)[action.name as any];
              const argsStr = action.args.join(",");

              console.log("[Vectora] Executando animação:", action.name, "com argumentos:", argsStr);

              if (!animationFn) throw new Error(`Animação não encontrada: ${action.name}`);

              await animationFn(element, argsStr);
            } else if ((actionExpr as any).type === "ActionSequence") {
              const seq = actionExpr as any as { type: string; parts: any[]; operators: string[] };
              // Atualmente só implementamos '++' como concatenação (sequencial)
              for (let idx = 0; idx < seq.parts.length; idx++) {
                const part = seq.parts[idx];
                const animationFn = (animations as any)[part.name as any];
                const argsStr = part.args.join(",");
                console.log("🎬 Executando (seq) animação:", part.name, "com argumentos:", argsStr);
                if (!animationFn) throw new Error(`Animação não encontrada: ${part.name}`);
                // '++' => aguarda cada animação terminar antes de continuar
                await animationFn(element, argsStr);
              }
            }
          }
        }
      }, elements);
    }
  }
}