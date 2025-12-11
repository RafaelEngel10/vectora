import { parseAnimString } from "../../dist/basics.js";
import { textAnimations } from "../../dist/anim/catalog/text/textAnimations.js";
import { colorAnimations } from "../anim/catalog/color/colorAnimations.js";
import { macron }from "../console.js";
import { animFilter } from "../../dist/anim/interpolation/filter.js"

let animations;

export function runActionOnElements(selector, action) {
  const els = document.querySelectorAll(selector);
  if (!els.length) {
    macron(`debug`, `nenhum elemento encontrado para selector: ${selector}, ${action}`)
    return;
  }

  const anims = [];
  let current = '';
  let depth = 0;
  
  for (const char of action.value) {
    if (char === '(') depth++;
    else if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      anims.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }


  console.log(`Switch de filtro de animações: ${action.value}`);
  let animationType = action.value;
  let animationTypes = animationType.match(/^([^(]+)/)[1];

  switch (animationTypes) {   // animation filter...
    /* text case */
    case 'fall': 
    case 'rise':  
    case 'fadeIn':  
    case 'fadeOut':
    case 'slideIn':
    case 'slideOut':  
    case 'shake': 
    case 'shiver':
    case 'pop':
    case 'implode':
    case 'rotate':
      animations = textAnimations;
      break;
    /* color case */
    case 'paint':
    case 'fadeColor': 
    case 'chameleonCamo': 
    case 'octopusCamo': 
    case 'liquidFill':
      animations = colorAnimations;
      break;
  }
  
  
  if (current.trim()) anims.push(current.trim());
  for (const el of els) {
    for (const anim of anims) {
      const animInfo = parseAnimString(anim);
      const fn = animations[animInfo.name];
    // Verifica compatibilidade por tipo
      const propType = action.prop.toLowerCase();
      const animState = animFilter(animInfo.name);

      if (animState[0] === 'none') {
        macron('debug', `Sem interpolações no script. Animação básica ${animInfo.name}`);
        // Filtra por tipo de propriedade
        if (
          (propType === 'text' && ['fall', 'rise', 'slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'pop', 'implode', 'shake', 'shiver', 'rotate'].includes(animInfo.name)) ||
          (propType === 'color' && ['paint', 'fadeColor', 'chameleonCamo', 'octopusCamo', 'liquidFill'].includes(animInfo.name))  
          //(propType === 'gap' && ['bloomGap', 'stagedGapColumn', 'stagedGapRow'].includes(animInfo.name)) ||
          //(propType === 'radius' && ['suddenChange'].includes(animInfo.name)) ||
          //(propType === 'weight' && ['skinny', 'heavy'].includes(animInfo.name)) ||  
          //(propType === 'brightness' && ['neon', 'pillar', 'halo', 'fadeLight'].includes(animInfo.name)) ||
          //(propType === 'shadow' && ['surge', 'purge', 'fadeDusk'].includes(animInfo.name)) ||
          //(propType === 'value' && ['searchValue'].includes(animInfo.name))
        ) {
          fn(el, animInfo.arg);
        } else {
          macron('warn', `animação '${animInfo.name}' não é compatível com a propriedade '${propType}'.`);
        }
      } 
      else {
        macron('debug', `Interpolações no script -> ${animState}`);
        const firstPart = animState[0];
        const secondPart = animState[1];
        macron('debug', `Animações individuais --> ${firstPart} e ${secondPart}`);
      }
    }
  }

  window.addEventListener('reveal.onScroll', (e) => {
    if (!e.detail.visible) return; // só dispara quando aparece
    const rules = cssRules['reveal.onScroll'];
    if (!rules) return;
    for (const { selector, actions } of rules) {
      runActionOnElements(selector, actions);
    }
  });
}