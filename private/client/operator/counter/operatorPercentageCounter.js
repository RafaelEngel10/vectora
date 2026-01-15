

import { incrementCounter } from '../../../../public/data/storageCount.js';
import { testCounterCondition, validateCounterOperator, extractCounterOperator } from '../../../../public/data/storageSearch.js';

/**
 * Handler do operador contador (%%)
 * Processa a contagem de execuções e retorna resultado baseado nas regras definidas
 * @param {string} animationName - Nome da animação para usar como chave única
 * @param {string} actionString - String de ação contendo o operador (ex: 'land() %%' ou 'land() %%5')
 * @returns {boolean} - Resultado do teste de contagem
 */
export function CounterOperatorHandler(animationName, actionString) {
  // Valida se há operador contador na string
  const counterOperator = extractCounterOperator(actionString);
  
  if (!counterOperator) {
    console.warn(`Nenhum operador contador encontrado em: ${actionString}`);
    return false;
  }

  // Valida formato do operador
  if (!validateCounterOperator(counterOperator)) {
    console.error(`Operador contador inválido: ${counterOperator}`);
    return false;
  }

  // Cria chave única combinando nome da animação com seletor (se disponível)
  const uniqueKey = `${animationName}_${generateKeyHash(actionString)}`;

  // Incrementa o contador
  incrementCounter(uniqueKey);

  // Testa a condição e retorna resultado
  const result = testCounterCondition(uniqueKey, counterOperator);
  
  console.debug(`Contador [${animationName}] | Operador: ${counterOperator} | Resultado: ${result}`);
  
  return result;
}

/**
 * Gera um hash simples para a string de ação
 * Útil para criar chaves únicas mesmo com strings ligeiramente diferentes
 * @param {string} str - String a hashear
 * @returns {string} - Hash simples
 */
function generateKeyHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Versão integrada que pode ser chamada durante execução de animações
 * Primeiro incrementa, depois testa, como descrito na documentação
 * @param {string} animationName - Nome da animação
 * @param {string} operator - Operador a processar
 * @returns {boolean} - Resultado final do teste
 */
export function executeCounterOperation(animationName, operator) {
  // Para cenários sem números: SOMA PRIMEIRO, depois VERIFICA
  if (operator === '%%') {
    const uniqueKey = `${animationName}_default`;
    incrementCounter(uniqueKey);
    return testCounterCondition(uniqueKey, operator);
  }

  // Para outros cenários: segue padrão normal
  const uniqueKey = `${animationName}_special`;
  incrementCounter(uniqueKey);
  return testCounterCondition(uniqueKey, operator);
}