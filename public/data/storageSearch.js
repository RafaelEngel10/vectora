import { getCounter } from './storageCount.js';

/**
 * Testa se o contador retorna TRUE baseado nas diferentes regras
 * @param {string} key - Chave única para identificar a animação
 * @param {string} operator - O operador completo (ex: '%%', '%%5', '%%x5')
 * @returns {boolean} - Resultado do teste
 */
export function testCounterCondition(key, operator) {
  const count = getCounter(key);

  // Cenário 1: %% (sem números) - retorna TRUE se par
  if (operator === '%%') {
    return count % 2 === 0;
  }

  // Cenário 2: %%5 (número específico) - retorna TRUE quando chega ao número
  const numberMatch = operator.match(/^%%(\d+)$/);
  if (numberMatch) {
    const targetNumber = parseInt(numberMatch[1], 10);
    return count === targetNumber;
  }

  // Cenário 3: %%x5 (divisível por número) - retorna TRUE se divisível
  const divisorMatch = operator.match(/^%%x(\d+)$/);
  if (divisorMatch) {
    const divisor = parseInt(divisorMatch[1], 10);
    return count % divisor === 0;
  }

  return false;
}

/**
 * Valida se o operador segue o formato correto
 * @param {string} operator - O operador a validar
 * @returns {boolean} - TRUE se válido, FALSE caso contrário
 */
export function validateCounterOperator(operator) {
  if (typeof operator !== 'string') return false;
  
  // Valida formatos: %%, %%número, %%xnúmero
  return /^%%((\d+)|x(\d+))?$/.test(operator);
}

/**
 * Extrai apenas o operador contador de uma string de ação
 * @param {string} actionString - String de ação com possível operador
 * @returns {string|null} - O operador encontrado ou null
 */
export function extractCounterOperator(actionString) {
  const match = actionString.match(/%%((\d+)|x(\d+))?/);
  return match ? match[0] : null;
}