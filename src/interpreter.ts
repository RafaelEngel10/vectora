import { textAnimations, AnimationName } from "./catalog/text/textAnimations";

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
  duration: number;
  unit: string;
};

// registra o trigger 
const triggerRegistry: Record<string, (cb: () => void) => void> = {
  // trigger que ativa ao carregar a página
  "window.onLoad": (cb) => {
    window.addEventListener("load", cb);
  }

  // outros triggers podem ser adicionados aqui
};

let animations = textAnimations;

export function interpret(ast: ProgramNode) {
  // Percorre cada regra da DSL
  for (const rule of ast.rules) {

    // Resolve o seletor CSS
    const elements = document.querySelectorAll<HTMLElement>(rule.selector);

    if (elements.length === 0) {
      console.warn(`Nenhum elemento encontrado para: ${rule.selector}`);
      continue;
    }

    // Cada regra pode ter vários triggers
    for (const trigger of rule.triggers) {

      const triggerFn = triggerRegistry[trigger.name];

      if (!triggerFn) {
        throw new Error(`Trigger não suportado: ${trigger.name}`);
      }

      // Registra o trigger
      triggerFn(() => {

        // Quando o trigger dispara, executa as statements
        for (const element of elements) {
          for (const statement of trigger.statements) {

            const action = statement.action;
            const animationFn = animations[action.name];

            if (!animationFn) {
              throw new Error(`Animação não encontrada: ${action.name}`);
            }

            // Executa animação catalogada
            animationFn(
              element,
              action.duration,
            );
          }
        }
      });
    }
  }
}