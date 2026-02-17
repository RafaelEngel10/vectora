import { triggerEvents } from "./events/triggerEvents.js";
import { filterAnim } from "./filter/filterAnim.js";
import { getOperationType, getAnimationMetadata, isAnimationValidForProperty, sumVectors, vectorToCssTransform, TransformVector, CssTransformFinal } from "./filter/animationMetadata.js";
import { reverseAnimation } from "./reverser/catalogedAnims.js";

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
  finalActions?: ActionNode[];
  delays?: (number | null)[];
  finalDelayMs?: number;
  properties?: (string | null)[];
  property?: string;
};

type ActionExpr = ActionNode | ActionSequenceNode;

// registra o trigger 
const triggerRegistry: Record<string, (cb: (targets?: HTMLElement[]) => any, elements: NodeListOf<HTMLElement>) => void> = triggerEvents;

// animations are selected dynamically via `filterAnim` based on action name

/**
 * Agrupa animações consecutivas que devem ser somadas
 * Retorna grupos de animações onde cada grupo deve ter seus vetores somados
 */
function groupAnimationsForSumming(parts: ActionNode[], operators: string[]): ActionNode[][] {
  if (parts.length === 0) return [];

  const groups: ActionNode[][] = [];
  const firstPart = parts[0];
  if (!firstPart) return [];
  
  let currentGroup: ActionNode[] = [firstPart];

  for (let idx = 1; idx < parts.length; idx++) {
    const prevPart = parts[idx - 1];
    const currentPart = parts[idx];
    
    if (!prevPart || !currentPart) continue;

    // operators holds the operator between parts[i-1] and parts[i],
    // so for parts[idx] we must read operators[idx - 1].
    const operator = operators[idx - 1] || "++";
    const operationType = getOperationType(prevPart.name as string, currentPart.name as string, operator);

    if (operationType === "soma") {
      // Continua no mesmo grupo (soma)
      currentGroup.push(currentPart);
    } else {
      // Nova concatenação, fecha grupo atual
      groups.push(currentGroup);
      currentGroup = [currentPart];
    }
  }

  // Adiciona o último grupo
  groups.push(currentGroup);
  return groups;
}

///
///Executa uma sequência de animações
///
///SOMA: Os vetores de transformação são combinados matematicamente
///      land (vertical) + slideIn (horizontal) = diagonal movement
///
///CONCATENAÇÃO: As animações são executadas sequencialmente com delays opcionais
///
async function executeAnimationSequence(element: HTMLElement, parts: ActionNode[], operators: string[], finalActions?: ActionNode[], delays?: (number | null)[], finalDelayMs?: number, property?: string) {
  const NewProp = property ?? "linear";
  console.log("[Vectora] Iniciando sequência de animações com", parts.length, "parte(s)");

  // Agrupa animações que devem ser somadas
  const groups = groupAnimationsForSumming(parts, operators);

  // Executa cada grupo sequencialmente
  for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
    const group = groups[groupIdx];
    if (!group || group.length === 0) continue;
    
    // Aplica delay se houver (delay vem antes da ação)
    if (delays && delays[groupIdx] !== undefined && delays[groupIdx] !== null) {
      console.log(`[Vectora] Aguardando ${delays[groupIdx]}ms antes de executar grupo ${groupIdx + 1}`);
      await new Promise(resolve => setTimeout(resolve, delays[groupIdx]!));
    }
    console.log(`[Vectora] Aplicando propriedade ${NewProp} à interpolação`);
    
    if (group.length === 1) {
      // Grupo com uma única animação: executa normalmente
      const part = group[0];
      if (!part) continue;
      
      if (part.name.includes('~')) {
        const result = reverseAnimation(part.name);
        const argsStr = part.args.join(",");

        if (!result) {
          throw new Error(`[Vectora] Animação não encontrada: ${part.name}`);
        }

        await Promise.resolve(result(element, argsStr));
      } 
      else {
        const animResult = filterAnim(part.name as string);
        const animationFn = animResult.fn;
        const argsStr = part.args.join(",");

        if (!animationFn) {
          throw new Error(`[Vectora] Animação não encontrada: ${part.name}`);
        }

        await Promise.resolve(animationFn(element, argsStr));
      }

      console.log(`[Vectora] Executando animação "${part.name}"`);
    } 
    else {
      // Grupo com múltiplas animações: SOMA dos vetores
      const animNames = group.map(p => p?.name || "?").join(" + ");
      console.log(`[Vectora] SOMA de ${group.length} animações: ${animNames}`);

      // Coleta metadados e vetores de todas as animações do grupo
      let resultVector: TransformVector = {};
      const totalDuration = 600; // duração padrão, deveria extrair de cada animação

      for (const part of group) {
        if (!part) continue;
        const meta = getAnimationMetadata(part.name as string);
        if (meta && meta.vector) {
          console.log(`  [${part.name}] vetor: ${JSON.stringify(meta.vector)}`);
          resultVector = sumVectors(resultVector, meta.vector);
        }
      }

      // aplica o vetor resultante como transformação CSS
      const cssTransform = vectorToCssTransform(resultVector);
      console.log(`  → Vetor resultante: ${cssTransform}`);

      // Executa a animação com transform resultante
      await new Promise<void>(resolve => {
        // Passo 1: Aplica posição INICIAL (onde começa) sem transição
        element.style.transition = 'none';
        element.style.transform = cssTransform;
        
        // Força reflow para garantir que a transição seja aplicada
        void element.offsetWidth;
        
        // Passo 2: Ativa transição e anima para posição FINAL
        element.style.transition = `transform ${totalDuration}ms ${NewProp}`;
        element.style.transform = 'none';

        const onEnd = () => {
          element.removeEventListener('transitionend', onEnd);
          resolve();
        };

        element.addEventListener('transitionend', onEnd);

        // Fallback timeout
        setTimeout(() => {
          element.removeEventListener('transitionend', onEnd);
          resolve();
        }, totalDuration + 50);
      });
    }
  }

  // Aplica delay antes das ações finais se houver
  if (finalDelayMs !== undefined && finalDelayMs !== null && finalDelayMs > 0) {
    console.log(`[Vectora] Aguardando ${finalDelayMs}ms antes de executar ações finais`);
    await new Promise(resolve => setTimeout(resolve, finalDelayMs));
  }

  // Executa as ações finais após a sequência terminar (manipulação de interpolação)
  if (finalActions && finalActions.length > 0) {
    for (const finalAction of finalActions) {
      console.log("[Vectora] Executando ação final (manipulação de interpolação):", finalAction.name);
      const animResult = filterAnim(finalAction.name as string);
      const animationFn = animResult.fn;
      const argsStr = finalAction.args.join(",");

      if (!animationFn) {
        throw new Error(`[Vectora] Animação final não encontrada: ${finalAction.name}`);
      }

      await Promise.resolve(animationFn(element, argsStr));
    }
  }
}

/// função principal de interpretação do AST
/// percorre o AST e registra os triggers, associonando-os aos elementos selecionados e executa as animações
export function interpret(ast: ProgramNode) {
  console.log("[Vectora] Iniciando interpretação de", ast.rules.length, "regra(s)");
  
  // percorre cada regra
  for (const rule of ast.rules) {
    console.log("[Vectora] Processando regra com seletor:", rule.selector);

    // resolução do seletor CSS (tags, classes e ids)
    const elements = document.querySelectorAll<HTMLElement>(rule.selector);

    if (elements.length === 0) {
      console.warn(`[Vectora] Nenhum elemento encontrado para: ${rule.selector}`);
      continue;
    }
    
    console.log(`[Vectora] ${elements.length} elemento(s) encontrado(s) para "${rule.selector}"`);

    // cada regra pode ter vários triggers
    for (const trigger of rule.triggers) {
      console.log("[Vectora] Registrando trigger:", trigger.name);

      // registro de gatilho usando a função correspondente do triggerRegistry
      const triggerFn = triggerRegistry[trigger.name];

      // caso o trigger digitado não exista no registro
      if (!triggerFn) {
        throw new Error(`[Vectora] Trigger não suportado: ${trigger.name}`);
      }

      // registra o trigger; o callback pode receber um array opcional de elementos-alvo
      triggerFn(async (targets?: HTMLElement[]) => {
        console.log("[Vectora] Trigger disparado:", trigger.name);

        // elementos do trigger 
        const runElements = targets && targets.length ? targets : Array.from(elements);

        // quando o trigger dispara, executa as statements apenas nos elementos alvo
        for (const element of runElements) {
          // executar cada statement em paralelo (cada statement pode conter uma sequência interna)
          const statementPromises: Promise<any>[] = [];

          for (const statement of trigger.statements) {
            const actionExpr = statement.action;
            const property = statement.property;

            /// caso seja uma animação comum
            if ((actionExpr as any).type === "Action") {
              const action = actionExpr as any as { type: string; name: string; args: (string | number)[] };
              
              // Valida se a animação é compatível com a propriedade
              const animName = action.name.startsWith("~") ? action.name.slice(1) : action.name;
              if (!isAnimationValidForProperty(animName, property)) {
                throw new Error(`[Vectora] Erro: A propriedade '${property}' não pode receber a animação '${animName}'. Animações compatíveis com '${property}' devem ser específicas dessa propriedade.`);
              }

              if (action.name.startsWith("~")) {
                statementPromises.push((async () => {
                  const animResult = reverseAnimation(action.name);
                  const argsStr = action.args.join(",");

                  console.log("[Vectora] Executando inverso de animação:", action.name, "\nCom argumentos:", argsStr);

                  if (!animResult) throw new Error(`[Vectora] Animação não encontrada para: ${action.name}`);

                  return await Promise.resolve(animResult(element, argsStr));
                })());
              } else {
                statementPromises.push((async () => {
                  const animResult = filterAnim(action.name as string);
                  const animationFn = animResult.fn;
                  const argsStr = action.args.join(",");
  
                  console.log("[Vectora] Executando animação:", action.name, "\nCom argumentos:", argsStr);
  
                  if (!animationFn) throw new Error(`[Vectora] Animação não encontrada: ${action.name}`);
  
                  // possibilidade de retorno de uma Promise; normalizamos com Promise.resolve
                  return await Promise.resolve(animationFn(element, argsStr));
                })());
              }
            } 
            /// caso seja uma sequência de animações (soma/concatenação)
            else if ((actionExpr as any).type === "ActionSequence") {                         
              const seq = actionExpr as any as { 
                type: string; 
                parts: any[]; 
                operators: string[]; 
                finalActions?: any[];
                delays?: (number | null)[];
                finalDelayMs?: number;
                properties?: string;
              };
              
              // Valida todas as animações na sequência
              for (const part of seq.parts) {
                const animName = part.name.startsWith("~") ? part.name.slice(1) : part.name;
                if (!isAnimationValidForProperty(animName, property)) {
                  throw new Error(`[Vectora] Erro: A propriedade '${property}' não pode receber a animação '${animName}'. Animações compatíveis com '${property}' devem ser específicas dessa propriedade.`);
                }
              }
              
              // Valida as ações finais também
              if (seq.finalActions) {
                for (const finalAction of seq.finalActions) {
                  const animName = finalAction.name.startsWith("~") ? finalAction.name.slice(1) : finalAction.name;
                  if (!isAnimationValidForProperty(animName, property)) {
                    throw new Error(`[Vectora] Erro: A propriedade '${property}' não pode receber a animação '${animName}' (ação final). Animações compatíveis com '${property}' devem ser específicas dessa propriedade.`);
                  }
                }
              }

              // Cada sequência deve rodar de forma sequencial, mas a sequência inteira pode rodar em paralelo com outras statements
              statementPromises.push(executeAnimationSequence(element, seq.parts, seq.operators, seq.finalActions, seq.delays, seq.finalDelayMs, seq.properties));
            }
          }

          // Aguarda todas as statements (cada uma já trata sequências internamente)
          await Promise.all(statementPromises);
        }
      }, elements);
    }
  }
}