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
  action: ActionNode;
};

type ActionNode = {
  type: "Action";
  name: AnimationName;
  args: (string | number)[];
};

// registra o trigger 
const triggerRegistry: Record<string, (cb: (targets?: HTMLElement[]) => void, elements: NodeListOf<HTMLElement>) => void> = triggerEvents;

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
      triggerFn((targets?: HTMLElement[]) => {
        console.log("⚡ Trigger disparado:", trigger.name);

        const runElements = targets && targets.length ? targets : Array.from(elements);

        // Quando o trigger dispara, executa as statements apenas nos elementos alvo
        for (const element of runElements) {
          for (const statement of trigger.statements) {

            const action = statement.action;
            const animationFn = animations[action.name];
            
            // Recombina argumentos em uma string separada por vírgula
            const argsStr = action.args.join(",");
            console.log("🎬 Executando animação:", action.name, "com argumentos:", argsStr);

            if (!animationFn) {
              throw new Error(`Animação não encontrada: ${action.name}`);
            }

            // Executa animação catalogada passando os argumentos como string
            animationFn(
              element,
              argsStr,
            );
          }
        }
      }, elements);
    }
  }
}