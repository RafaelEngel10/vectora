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

  // Executar todas as animações em paralelo
  // Podem ser de famílias diferentes (ex: fall + slideIn)
  // ou de subfamílias diferentes dentro da mesma família (ex: fall + slideIn ambas vetoriais)
  const promises = animations.map(anim => {
    const cleanName = anim.split('(')[0].trim();
    const fn = animationLibrary[cleanName];
    
    if (fn && typeof fn === 'function') {
      // Extrair argumentos da string de animação
      const match = anim.match(/\(([^)]*)\)/);
      const args = match ? match[1] : '';
      return fn(element, args);
    } else {
      console.warn(`Animação '${cleanName}' não encontrada na biblioteca`);
    }
    
    return Promise.resolve();
  });

  // Executar todas as animações em paralelo (soma)
  await Promise.all(promises);
}

async function processCombinedAnimations(animationString, element, animationLibrary) {
  // Parse da string de animações
  const parts = animationString.split('++').map(p => p.trim());
  
  const families = parts.map(anim => {
    const cleanName = anim.split('(')[0].trim();
    return getAnimationFamily(cleanName);
  });

  // Verificar se todas as famílias são iguais (concatenação) ou diferentes/subfamílias (soma)
  const allSameFamily = families.every(f => f === families[0]);

  if (allSameFamily && families[0] === ANIMATION_FAMILIES.VECTOR) {
    // Caso especial: animações vetoriais podem ter subfamílias diferentes
    // Nesse caso, é soma (não concatenação)
    // Para simplificar, sempre executar em paralelo (soma)
    await applySumAnimation(parts, element, animationLibrary);
  } else if (allSameFamily) {
    // Concatenação: executar sequencialmente (mesma família, não vetorial)
    for (const anim of parts) {
      const cleanName = anim.split('(')[0].trim();
      const fn = animationLibrary[cleanName];
      
      if (fn && typeof fn === 'function') {
        const match = anim.match(/\(([^)]*)\)/);
        const args = match ? match[1] : '';
        await fn(element, args);
      }
    }
  } else {
    // Soma: executar em paralelo (famílias diferentes)
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
