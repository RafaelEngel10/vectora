export const ANIMATION_FAMILIES = {
  VECTOR: 'vectorial',
  SCALAR: 'scalar',
  ADIMENSIONAL: 'adimensional',
};

// Sub-famílias de animações vetoriais
export const VECTOR_SUBFAMILIES = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  DIAGONAL: 'diagonal',
};

// Definição de qual família cada animação pertence
// Baseado em grandezas físicas: vetorial (com direção), escalar (magnitude pura) e adimensional (sem propriedade física)
const ANIMATION_FAMILY_MAP = {
  // VECTORIAL: animações com movimento/direção
  'land': ANIMATION_FAMILIES.VECTOR,
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

// Mapa de sub-famílias para animações vetoriais
// APENAS animações vetoriais possuem sub-famílias
const VECTOR_SUBFAMILY_MAP = {
  // HORIZONTAL: movimento na direção X
  'slideIn': VECTOR_SUBFAMILIES.HORIZONTAL,
  'slideOut': VECTOR_SUBFAMILIES.HORIZONTAL,

  // VERTICAL: movimento na direção Y
  'land': VECTOR_SUBFAMILIES.VERTICAL,
  'rise': VECTOR_SUBFAMILIES.VERTICAL,

  // DIAGONAL: movimento em múltiplas direções
  'shake': VECTOR_SUBFAMILIES.DIAGONAL,
  'rotate': VECTOR_SUBFAMILIES.DIAGONAL,
  'bloom': VECTOR_SUBFAMILIES.DIAGONAL,
  'stagedBloom': VECTOR_SUBFAMILIES.DIAGONAL,
  'surge': VECTOR_SUBFAMILIES.DIAGONAL,
  'purge': VECTOR_SUBFAMILIES.DIAGONAL,
};


export function familyFilter(el, actions) {
  const actionsList = actions.split('++');
  for (const action of actionsList) {
    const animationFamily = ANIMATION_FAMILY_MAP[action];
    
  }
}