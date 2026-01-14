/**
 * Módulo de soma de animações do Vectora
 * Responsável por combinar animações de famílias diferentes
 * e executar a resultante
 */

import { getAnimationFamily, ANIMATION_FAMILIES } from '../familyFilter.js';

/**
 * Calcula a resultante de animações vetoriais
 * Agrupa animações por propriedade e combina seus efeitos
 * @param {Array} animations - Array de nomes de animações
 * @returns {Object} - Objeto com propriedades combinadas
 */
function calculateVectoralSum(animations) {
  // Este é um exemplo simplificado
  // Na prática, você precisaria acessar os parâmetros reais de cada animação
  // e calcular a resultante vetorial (diagonal, magnitude, etc)
  
  const result = {
    movements: [],
    direction: null,
    magnitude: 1,
  };

  for (const anim of animations) {
    result.movements.push(anim);
  }

  // Aqui você implementaria a lógica de resultante vetorial
  // Por exemplo: fall() [vertical] + slideIn() [horizontal] = diagonal
  result.direction = 'resultant';

  return result;
}

/**
 * Calcula a resultante de animações escalares
 * Multiplica as escalas/magnitudes
 * @param {Array} animations - Array de nomes de animações
 * @returns {Object} - Objeto com magnitudes combinadas
 */
function calculateScalarSum(animations) {
  const result = {
    scales: [],
    combinedMagnitude: 1,
  };

  for (const anim of animations) {
    result.scales.push(anim);
  }

  // Aqui você implementaria a multiplicação de escalas
  // Por exemplo: zoomIn(1.5) + zoomOut(0.8) seria tratado conforme a ordem

  return result;
}

/**
 * Calcula a soma de animações adimensionais
 * Sobrepõe efeitos sem considerar direção
 * @param {Array} animations - Array de nomes de animações
 * @returns {Object} - Objeto com efeitos sobrespostos
 */
function calculateAdimensionalSum(animations) {
  const result = {
    effects: animations,
    composition: 'superposed',
  };

  return result;
}

/**
 * Combina a resultante de animações de famílias diferentes
 * Executa a soma vetorial/escalar quando apropriado
 * @param {Array} animations - Array de nomes de animações (com parâmetros)
 * @param {HTMLElement} element - Elemento DOM a animar
 * @param {Object} animationLibrary - Objeto com funções de animação
 * @returns {Promise} - Promise que resolve quando a soma é aplicada
 */
async function applySumAnimation(animations, element, animationLibrary) {
  if (animations.length < 2) {
    console.warn('Soma requer pelo menos 2 animações');
    return;
  }

  // Obter famílias das animações
  const families = animations.map(anim => {
    const cleanName = anim.split('(')[0].trim();
    return getAnimationFamily(cleanName);
  });

  // Verificar se são de famílias diferentes
  const hasMultipleFamilies = new Set(families).size > 1;
  
  if (!hasMultipleFamilies) {
    console.warn('Soma requer animações de famílias diferentes');
    return;
  }

  // Agrupar animações por família
  const byFamily = {
    [ANIMATION_FAMILIES.VECTOR]: [],
    [ANIMATION_FAMILIES.SCALAR]: [],
    [ANIMATION_FAMILIES.ADIMENSIONAL]: [],
  };

  animations.forEach((anim, index) => {
    if (families[index]) {
      byFamily[families[index]].push(anim);
    }
  });

  // Calcular resultantes por tipo de grandeza
  const vectorialResult = byFamily[ANIMATION_FAMILIES.VECTOR].length > 0
    ? calculateVectoralSum(byFamily[ANIMATION_FAMILIES.VECTOR])
    : null;

  const scalarResult = byFamily[ANIMATION_FAMILIES.SCALAR].length > 0
    ? calculateScalarSum(byFamily[ANIMATION_FAMILIES.SCALAR])
    : null;

  const adimensionalResult = byFamily[ANIMATION_FAMILIES.ADIMENSIONAL].length > 0
    ? calculateAdimensionalSum(byFamily[ANIMATION_FAMILIES.ADIMENSIONAL])
    : null;

  // Aqui você combinaria os resultados e executaria a animação final
  // Por enquanto, executamos cada animação individualmente em paralelo
  const promises = animations.map(anim => {
    const cleanName = anim.split('(')[0].trim();
    const fn = animationLibrary[cleanName];
    
    if (fn && typeof fn === 'function') {
      // Extrair argumentos da string de animação
      const match = anim.match(/\(([^)]*)\)/);
      const args = match ? match[1].split(',').map(a => a.trim()) : [];
      return fn(element, ...args);
    }
    
    return Promise.resolve();
  });

  // Executar todas as animações em paralelo (soma)
  await Promise.all(promises);
}

/**
 * Processa uma string de animações com operador '++' e determina soma/concatenação
 * @param {string} animationString - String como "fall() ++ slideIn()" 
 * @param {HTMLElement} element - Elemento a animar
 * @param {Object} animationLibrary - Biblioteca de funções de animação
 * @returns {Promise} - Promise que resolve após execução
 */
async function processCombinedAnimations(animationString, element, animationLibrary) {
  // Parse da string de animações
  const parts = animationString.split('++').map(p => p.trim());
  
  const families = parts.map(anim => {
    const cleanName = anim.split('(')[0].trim();
    return getAnimationFamily(cleanName);
  });

  // Verificar se todas as famílias são iguais (concatenação) ou diferentes (soma)
  const allSameFamily = families.every(f => f === families[0]);

  if (allSameFamily) {
    // Concatenação: executar sequencialmente
    for (const anim of parts) {
      const cleanName = anim.split('(')[0].trim();
      const fn = animationLibrary[cleanName];
      
      if (fn && typeof fn === 'function') {
        const match = anim.match(/\(([^)]*)\)/);
        const args = match ? match[1].split(',').map(a => a.trim()) : [];
        await fn(element, ...args);
      }
    }
  } else {
    // Soma: executar em paralelo
    await applySumAnimation(parts, element, animationLibrary);
  }
}

export {
  calculateVectoralSum,
  calculateScalarSum,
  calculateAdimensionalSum,
  applySumAnimation,
  processCombinedAnimations,
};
