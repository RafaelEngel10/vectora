import { parseAnimString } from "../../dist/basics.js";
import { textAnimations } from "../../dist/anim/catalog/text/textAnimations.js";
import { colorAnimations } from "../anim/catalog/color/colorAnimations.js";
import { macron }from "../console.js";
import { animFilter } from "../../dist/anim/interpolation/filter.js";
import { valueFilter } from "../../dist/anim/interpolation/value.js";
import { transformAnimations } from "../../dist/anim/catalog/transform/transform.js";
import { backgroundColor } from "../../dist/anim/catalog/background/color/backgroundColor.js";
import { backgroundImage } from "../../dist/anim/catalog/background/image/backgroundImage.js";
import { shadowAnimations } from "../../dist/anim/catalog/shadow/shadowAnimations.js";
import { radiusAnimations } from "../../dist/anim/catalog/radius/radiusAnimations.js";
import { gapAnimations } from "../../dist/anim/catalog/gap/gapAnimations.js";
import { filterAnimationFamilies, resolveAnimationCombination } from "../../dist/anim/interpolation/familyFilter.js";
import { processCombinedAnimations } from "../../dist/anim/interpolation/sum/animationSum.js";

let animations;

export async function runActionOnElements(selector, action) {
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

  let animationType = action.value;
  let animationTypes = animationType.match(/^([^(]+)/)[1];


  //verifica se há operadores lógicos dentro da propriedade
  // ***DESTAQUE***
  let animVerify = animationType.includes('++')
  if (animVerify) {
    macron('log',`Switch de filtro de animações: ${action.value}`);
    
    // Usar o módulo familyFilter para processar combinações
    const combinationResult = resolveAnimationCombination(action.value);
    macron('log', `Tipo de combinação: ${combinationResult.type}`);
    
    if (combinationResult.type === 'concatenation') {
      // Concatenação: executar animações em fila (sequencial)
      for (const el of els) {
        const parts = action.value.split('++').map(p => p.trim());
        for (const part of parts) {
          const cleanName = part.split('(')[0].trim();
          
          // Determinar qual biblioteca usar
          switch (cleanName) {
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
            case 'spin':
              animations = textAnimations;
              break;
            case 'paint':
            case 'fadeColor': 
            case 'chameleonCamo': 
            case 'octopusCamo': 
            case 'liquidFill':
              if (action.prop.toLowerCase() === 'background.color') {
                animations = backgroundColor;
              } else {
                animations = colorAnimations;
              }
              break;
            case 'rotate':
            case 'zoomIn':
            case 'zoomOut':
            case 'mirror':
              animations = transformAnimations;
              break;
            case 'surge':
            case 'fadeDusk':
            case 'purge':
              animations = shadowAnimations;
              break;
            case 'bloom':
            case 'stagedBloom':
              animations = gapAnimations;
              break;
            case 'round':
            case 'corner':
              animations = radiusAnimations;
              break;
            default:
              macron('warn', `Sem filtragem para ${cleanName}`);
          }
          
          const fn = animations[cleanName];
          if (fn && typeof fn === 'function') {
            const animInfo = parseAnimString(part);
            await fn(el, animInfo.arg);
          }
        }
      }
    } else if (combinationResult.type === 'sum') {
      // Soma: processar com o módulo de soma
      for (const el of els) {
        await processCombinedAnimations(action.value, el, animations);
      }
    }
    
    return; // Pular a execução padrão
  }

  let types = '';
  let originalType = '';
  let jk = 0;
  
  if (current.trim()) anims.push(current.trim());
  for (const el of els) {
    for (const anim of anims) {
      const animInfo = parseAnimString(anim);
      // Verifica compatibilidade por tipo
      const propType = action.prop.toLowerCase();
      const animState = animFilter(animInfo.name);

      types = animState.type;

      if (animState.type !== 'NONE' || types !== 'NONE') {

        const firstAnim = animState.parts[0].split('(')[0];
        const secondAnim = animState.parts[1].split('(')[0];
        let anima = [firstAnim, secondAnim]

        for (const part of anima) {
          animInfo.name = part;

          macron('log',`Switch de filtro de animações: ${animInfo.name}`);
          switch (part) {   // animation filter...
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
            case 'spin':
              animations = textAnimations;
              break;
            /* color case */
            case 'paint':
            case 'fadeColor': 
            case 'chameleonCamo': 
            case 'octopusCamo': 
            case 'liquidFill':
              if (action.prop.toLowerCase() === 'background.color') {
                animations = backgroundColor;
              } else {
                animations = colorAnimations;
              }
              break;
            /* transform case */
            case 'rotate':
            case 'zoomIn':
            case 'zoomOut':
            case 'mirror':
              animations = transformAnimations;
              break;
            /* shadow case */
            case 'surge':
            case 'fadeDusk':
            case 'purge':
              animations = shadowAnimations;
              break;
            /* radius case */
            case 'round':
            case 'corner':
              animations = radiusAnimations;
              break;
            /* gap case */
            case 'bloom':
            case 'stagedBloom':
              animations = gapAnimations;
              break;
            /* default case */
            default:
              macron('warn', `Sem filtragem para ${animationTypes}`)
          }
          macron('debug', `Interpolações no script. Animação em execução: ${part}`);
          const fn = animations[part];
        
          if (
            (propType === 'text' && ['fall', 'rise', 'slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'pop', 'implode', 'shake', 'shiver', 'spin'].includes(part)) ||
            (propType === 'color' && ['paint', 'fadeColor', 'chameleonCamo', 'octopusCamo', 'liquidFill'].includes(part)) ||
            (propType === 'transform' && ['rotate', 'zoomIn', 'zoomOut', 'mirror'].includes(part))  ||
            (propType === 'background.color' && ['paint', 'fadeColor', 'chameleonCamo', 'octopusCamo', 'liquidFill'].includes(part)) ||
            (propType === 'gap' && ['bloom', 'stagedBloom'].includes(part)) ||
            (propType === 'radius' && ['round', 'corner'].includes(part)) ||
            (propType === 'weight' && ['skinny', 'heavy'].includes(part)) ||  
            (propType === 'brightness' && ['neon', 'pillar', 'halo', 'fadeLight'].includes(part)) ||
            (propType === 'shadow' && ['surge', 'purge', 'fadeDusk'].includes(part)) 
            //(propType === 'value' && ['searchValue'].includes(part))
          ) {
            await fn(el, animInfo.arg);
          }
        }
      }
      
      const fn = animations[animInfo.name];

      if (animState.type === 'NONE' || types === 'NONE') {
        macron('debug', `Sem interpolações no script. Animação básica ${animInfo.name}`);

        if (
          (propType === 'text' && ['fall', 'rise', 'slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'pop', 'implode', 'shake', 'shiver', 'spin'].includes(animInfo.name)) ||
          (propType === 'color' && ['paint', 'fadeColor', 'chameleonCamo', 'octopusCamo', 'liquidFill'].includes(animInfo.name)) ||
          (propType === 'transform' && ['rotate', 'zoomIn', 'zoomOut', 'mirror'])  ||
          (propType === 'background.color' && ['paint', 'fadeColor', 'chameleonCamo', 'octopusCamo', 'liquidFill'].includes(animInfo.name)) ||
          (propType === 'gap' && ['bloom', 'stagedBloom'].includes(animInfo.name)) ||
          (propType === 'radius' && ['round', 'corner'].includes(animInfo.name)) ||
          (propType === 'weight' && ['skinny', 'heavy'].includes(animInfo.name)) ||  
          (propType === 'brightness' && ['neon', 'pillar', 'halo', 'fadeLight'].includes(animInfo.name)) ||
          (propType === 'shadow' && ['surge', 'purge', 'fadeDusk'].includes(animInfo.name)) 
          //(propType === 'value' && ['searchValue'].includes(animInfo.name))
        ) {
          await fn(el, animInfo.arg);
          jk++;
        } else {
          macron('warn', `animação '${animInfo.name}' não é compatível com a propriedade '${propType}'.`);
        }
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