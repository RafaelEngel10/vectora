/**
 * Incrementa o contador armazenado no localStorage para uma chave específica
 * @param {string} key - Chave única para identificar a animação
 * @returns {number} - O novo valor da contagem após incremento
 */
export function incrementCounter(key) {
  const storageKey = `counter_${key}`;
  let currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
  currentCount += 1;
  localStorage.setItem(storageKey, currentCount.toString());
  return currentCount;
}

/**
 * Obtém o valor atual da contagem armazenada
 * @param {string} key - Chave única para identificar a animação
 * @returns {number} - O valor atual da contagem
 */
export function getCounter(key) {
  const storageKey = `counter_${key}`;
  return parseInt(localStorage.getItem(storageKey) || '0', 10);
}

/**
 * Reseta a contagem para uma chave específica
 * @param {string} key - Chave única para identificar a animação
 */
export function resetCounter(key) {
  const storageKey = `counter_${key}`;
  localStorage.removeItem(storageKey);
}