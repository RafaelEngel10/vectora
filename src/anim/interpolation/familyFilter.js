/**
 * Módulo de filtro de famílias de animações do Vectora
 * Responsável por identificar e processar animações conforme suas famílias
 */

// Mapa de famílias de animações
const ANIMATION_FAMILIES = {
  VECTOR: 'vectorial',
  SCALAR: 'scalar',
  ADIMENSIONAL: 'adimensional',
};

// Definição de qual família cada animação pertence
// Baseado em grandezas físicas: vetorial (com direção), escalar (magnitude pura) e adimensional (sem propriedade física)
const ANIMATION_FAMILY_MAP = {
  // VECTORIAL: animações com movimento/direção
  'fall': ANIMATION_FAMILIES.VECTOR,
  'rise': ANIMATION_FAMILIES.VECTOR,
  'slideIn': ANIMATION_FAMILIES.VECTOR,
  'slideOut': ANIMATION_FAMILIES.VECTOR,
  'shake': ANIMATION_FAMILIES.VECTOR,
  'rotate': ANIMATION_FAMILIES.VECTOR,
  'bloom': ANIMATION_FAMILIES.VECTOR,
  'stagedBloom': ANIMATION_FAMILIES.VECTOR,
  'surge': ANIMATION_FAMILIES.VECTOR,
  'purge': ANIMATION_FAMILIES.VECTOR,

  // SCALAR: animações de magnitude/escala sem direção
  'zoomIn': ANIMATION_FAMILIES.SCALAR,
  'zoomOut': ANIMATION_FAMILIES.SCALAR,
  'mirror': ANIMATION_FAMILIES.SCALAR,
  'round': ANIMATION_FAMILIES.SCALAR,
  'corner': ANIMATION_FAMILIES.SCALAR,
  'skinny': ANIMATION_FAMILIES.SCALAR,
  'heavy': ANIMATION_FAMILIES.SCALAR,
  'halo': ANIMATION_FAMILIES.SCALAR,
  'fadeLight': ANIMATION_FAMILIES.SCALAR,
  'neon': ANIMATION_FAMILIES.SCALAR,
  'pillar': ANIMATION_FAMILIES.SCALAR,
  'fadeDusk': ANIMATION_FAMILIES.SCALAR,

  // ADIMENSIONAL: animações sem propriedade física mensurada
  'fadeIn': ANIMATION_FAMILIES.ADIMENSIONAL,
  'fadeOut': ANIMATION_FAMILIES.ADIMENSIONAL,
  'pop': ANIMATION_FAMILIES.ADIMENSIONAL,
  'implode': ANIMATION_FAMILIES.ADIMENSIONAL,
  'shiver': ANIMATION_FAMILIES.ADIMENSIONAL,
  'spin': ANIMATION_FAMILIES.ADIMENSIONAL,
  'fadeColor': ANIMATION_FAMILIES.ADIMENSIONAL,
  'chameleonCamo': ANIMATION_FAMILIES.ADIMENSIONAL,
  'octopusCamo': ANIMATION_FAMILIES.ADIMENSIONAL,
  'paint': ANIMATION_FAMILIES.ADIMENSIONAL,
  'liquidFill': ANIMATION_FAMILIES.ADIMENSIONAL,
};

/**
 * Obtém a família de uma animação pelo seu nome
 * @param {string} animationName - Nome da animação (sem parênteses)
 * @returns {string|null} - Família da animação ou null se não encontrada
 */
function getAnimationFamily(animationName) {
  // Remove parênteses e parâmetros se existirem
  const cleanName = animationName.split('(')[0].trim();
  return ANIMATION_FAMILY_MAP[cleanName] || null;
}

/**
 * Filtra uma coleção de animações pela mesma família
 * Identifica animações separadas pelo operador '++'
 * @param {string|Array} animations - String com animações separadas por '++' ou array de strings
 * @returns {Array} - Array de animações que pertencem à mesma família
 */
function filterAnimationFamilies(animations) {
  // Normalizar entrada para array
  let animArray = [];
  if (typeof animations === 'string') {
    animArray = animations
      .split('++')
      .map(anim => anim.trim())
      .filter(anim => anim.length > 0);
  } else if (Array.isArray(animations)) {
    animArray = animations;
  } else {
    return [];
  }

  if (animArray.length === 0) {
    return [];
  }

  // Obter a família da primeira animação
  const firstFamily = getAnimationFamily(animArray[0]);
  
  // Se a primeira animação não tem família válida, retornar vazio
  if (!firstFamily) {
    return [];
  }

  // Filtrar apenas animações da mesma família
  const sameFamily = animArray.filter(anim => {
    const family = getAnimationFamily(anim);
    return family === firstFamily;
  });

  return sameFamily;
}

/**
 * Determina se a combinação de animações deve ser soma ou concatenação
 * Com base nas regras de familiaridade
 * @param {Array} animations - Array de animações a combinar
 * @returns {Object} - Objeto com tipo de combinação e resultado
 * @returns {string} returns.type - 'sum' (soma) ou 'concatenation' (concatenação)
 * @returns {Array} returns.animations - Array de animações
 * @returns {string} returns.description - Descrição da combinação
 */
function resolveAnimationCombination(animations) {
  // Normalizar entrada
  let animArray = Array.isArray(animations) ? animations : [animations];
  animArray = animArray
    .map(anim => (typeof anim === 'string' ? anim.trim() : anim))
    .filter(anim => anim);

  if (animArray.length < 2) {
    return {
      type: 'single',
      animations: animArray,
      description: 'Uma única animação, sem combinação necessária'
    };
  }

  // Obter famílias de todas as animações
  const families = animArray.map(anim => getAnimationFamily(anim));

  // Verificar se todas as famílias são iguais
  const allSameFamily = families.every(family => family === families[0]);

  if (allSameFamily && families[0] !== null) {
    // Concatenação: mesma família
    return {
      type: 'concatenation',
      animations: animArray,
      description: `Concatenação de ${animArray.length} animações da família ${families[0]}`
    };
  } else if (families.every(family => family !== null)) {
    // Soma: famílias diferentes
    return {
      type: 'sum',
      animations: animArray,
      description: `Soma de ${animArray.length} animações de famílias diferentes: ${families.join(', ')}`
    };
  } else {
    // Erro: alguma animação não foi identificada
    return {
      type: 'error',
      animations: animArray,
      description: 'Algumas animações não foram identificadas corretamente'
    };
  }
}

/**
 * Aplica um segundo filtro independente para decidir combinação final
 * Recebe o resultado do primeiro filtro e aplica lógica adicional
 * @param {Object} firstFilterResult - Resultado do filterAnimationFamilies
 * @param {string} mode - 'sum' ou 'concatenation' para forçar um tipo específico (opcional)
 * @returns {Object} - Objeto com decisão final de combinação
 */
function applySecondFilter(firstFilterResult, mode = null) {
  if (!Array.isArray(firstFilterResult) || firstFilterResult.length === 0) {
    return {
      type: 'empty',
      animations: [],
      description: 'Nenhuma animação para processar'
    };
  }

  // Se um modo foi explicitamente fornecido, usar esse
  if (mode === 'sum' || mode === 'concatenation') {
    return {
      type: mode,
      animations: firstFilterResult,
      description: `Modo ${mode} aplicado explicitamente`
    };
  }

  // Caso contrário, usar a lógica padrão do resolveAnimationCombination
  return resolveAnimationCombination(firstFilterResult);
}

// Exportações
module.exports = {
  filterAnimationFamilies,
  resolveAnimationCombination,
  applySecondFilter,
  ANIMATION_FAMILIES,
  ANIMATION_FAMILY_MAP,
  getAnimationFamily
};
