import { textAnimations } from "../../dist/src/anim/catalog/text/textAnimations.js";
import { colorAnimations } from "../anim/catalog/color/colorAnimations.js";
import { transformAnimations } from "../../dist/src/anim/catalog/transform/transform.js";
import { backgroundColor } from "../../dist/src/anim/catalog/background/color/backgroundColor.js";
import { backgroundImage } from "../../dist/src/anim/catalog/background/image/backgroundImage.js";
import { shadowAnimations } from "../../dist/src/anim/catalog/shadow/shadowAnimations.js";
import { radiusAnimations } from "../../dist/src/anim/catalog/radius/radiusAnimations.js";
import { gapAnimations } from "../../dist/src/anim/catalog/gap/gapAnimations.js";
import { parseAnimString } from "../../dist/basics.js";
import { macron }from "../console.js";
import { filterAnimation } from "../filter/switchFilterAnimation.js";
import { hasConditionalKeywords, filterKeywordActions } from "../filter/keywordFilters.js";
import { OperatorFilter } from "../filter/logicOperatorsFilters.js";

let animations;

export async function runActionOnElements(selector, action) {
  const els = document.querySelectorAll(selector);
  if (!els.length) {
    macron(`debug`, `nenhum elemento encontrado para selector: ${selector}, ${action}`)
    return;
  }

  // Check if action contains conditional keywords
  if (hasConditionalKeywords(action.value)) {
    macron('log', `Detectadas palavras-chave condicionais em: ${action.value}`);
    
    for (const el of els) {
      // Create an executor function for animations within conditions
      const executeAnimationAction = async (actionString, element) => {
        await runSingleAction(actionString.trim(), element, action.prop);
      };

      // Process the conditional keywords
      await filterKeywordActions(action.value, el, executeAnimationAction);
    }
    return;
  }

  const verification = action.value.includes('++') || action.value.includes('~~') || action.value.includes('%%');
  if (verification) {
    macron('log', `Operadores lógicos detectados em: ${selector}, ${action.value}`);
    OperatorFilter(selector, action.value);
  }

  // Original animation processing for non-conditional actions
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
  
  if (current.trim()) anims.push(current.trim());
  
  for (const el of els) {
    await processAnimationsOnElement(el, anims, action.prop);
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





/**
 * Executes a single action on an element
 * @param {string} actionString - The action string (animation name and args)
 * @param {HTMLElement} element - The element to apply to
 * @param {string} propType - The property type (text, color, transform, etc)
 */
function runSingleAction(actionString, element, propType) {
  const animInfo = parseAnimString(actionString);
  const propTypeNormalized = propType.toLowerCase();

  const cleanAnimName = returnClearString(animInfo.name);
  animations = filterAnimation(cleanAnimName);

  if (isAnimationCompatible(propTypeNormalized, cleanAnimName)) {
    const fn = animations[cleanAnimName];
    
    if (fn && typeof fn === 'function') {
      fn(element, animInfo.arg);
      macron('debug', `Ação executada: ${animInfo.name} na propriedade ${propTypeNormalized}`);
    } else {
      macron('warn', `Função '${animInfo.name}' não encontrada na biblioteca`);
    }
  } else {
    macron('warn', `animação '${animInfo.name}' não é compatível com a propriedade '${propTypeNormalized}'.`);
  }
}





/**
 * Processes multiple animations on a single element
 * @param {HTMLElement} element - The element to process
 * @param {Array} anims - Array of animation strings
 * @param {string} propType - The property type
 */
async function processAnimationsOnElement(element, anims, propType) {
  const propTypeNormalized = propType.toLowerCase();

  for (const anim of anims) {
    const animInfo = parseAnimString(anim);
    const cleanAnimName = returnClearString(animInfo.name);
    animations = filterAnimation(cleanAnimName);

    if (animations) {
      if (isAnimationCompatible(propTypeNormalized, cleanAnimName)) {
        const fn = animations[cleanAnimName];
        if (fn && typeof fn === 'function') {
          await fn(element, animInfo.arg);
          macron('debug', `Sem interpolações no script. Animação básica ${cleanAnimName}`);
        } else {
          macron('warn', `Função '${animInfo.name}' não encontrada na biblioteca`);
        }
      } else {
        macron('warn', `animação '${animInfo.name}' não é compatível com a propriedade '${propTypeNormalized}'.`);
      }
    } else {
      macron('warn', `Biblioteca de animações não foi inicializada para ${animInfo.name}`);
    }
  }
}





/**
 * Checks if an animation is compatible with a property type
 * @param {string} propType - The property type
 * @param {string} animationName - The animation name
 * @returns {boolean} - True if compatible
 */
function isAnimationCompatible(propType, animationName) {
  const textAnims = ['land', 'rise', 'slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'pop', 'implode', 'shake', 'shiver', 'spin'];
  const colorAnims = ['paint', 'fadeColor', 'chameleonCamo', 'octopusCamo', 'liquidFill'];
  const transformAnims = ['rotate', 'zoomIn', 'zoomOut', 'mirror'];
  const gapAnims = ['bloom', 'stagedBloom'];
  const radiusAnims = ['round', 'corner'];
  const weightAnims = ['skinny', 'heavy'];
  const brightnessAnims = ['neon', 'pillar', 'halo', 'fadeLight'];
  const shadowAnims = ['surge', 'purge', 'fadeDusk'];

  const propTypeMap = {
    'text': textAnims,
    'color': colorAnims,
    'transform': transformAnims,
    'background.color': colorAnims,
    'gap': gapAnims,
    'radius': radiusAnims,
    'weight': weightAnims,
    'brightness': brightnessAnims,
    'shadow': shadowAnims
  };

  const compatibleAnims = propTypeMap[propType] || [];
  return compatibleAnims.includes(animationName);
}




function returnClearString(cleanName) {
  // Remove parênteses e argumentos, operadores e espaços extras
  return cleanName
    .split('(')[0]
    .trim();                     // Remove espaços extras
}