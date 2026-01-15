import { textAnimations } from "../../dist/anim/catalog/text/textAnimations.js";
import { colorAnimations } from "../anim/catalog/color/colorAnimations.js";
import { transformAnimations } from "../../dist/anim/catalog/transform/transform.js";
import { backgroundColor } from "../../dist/anim/catalog/background/color/backgroundColor.js";
import { backgroundImage } from "../../dist/anim/catalog/background/image/backgroundImage.js";
import { shadowAnimations } from "../../dist/anim/catalog/shadow/shadowAnimations.js";
import { radiusAnimations } from "../../dist/anim/catalog/radius/radiusAnimations.js";
import { gapAnimations } from "../../dist/anim/catalog/gap/gapAnimations.js";
import { parseAnimString } from "../../dist/basics.js";
import { macron }from "../console.js";
import { filterAnimation } from "../filter/switchFilterAnimation.js";

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
    macron('log', `Tipo de combinação`);
    
    // Mostrar detalhes adicionais para animações vetoriais
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
      const animState = 'NONE';

      if (animState !== 'NONE') {

        const firstAnim = animState.parts[0].split('(')[0];
        const secondAnim = animState.parts[1].split('(')[0];
        let anima = [firstAnim, secondAnim]

        for (const part of anima) {
          animInfo.name = part;

          macron('log',`Switch de filtro de animações: ${animInfo.name}`);
          
          animations = filterAnimation(part);

          macron('debug', `Interpolações no script. Animação em execução: ${part}`);
          
          if (animations) {
            const fn = animations[part];
            
            if (
              (propType === 'text' && ['land', 'rise', 'slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'pop', 'implode', 'shake', 'shiver', 'spin'].includes(part)) ||
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
              if (fn && typeof fn === 'function') {
                await fn(el, animInfo.arg);
              }
            }
          } else {
            macron('warn', `Biblioteca de animações não foi inicializada para ${part}`);
          }
        }
      }
        macron('debug', `Sem interpolações no script. Animação básica ${animInfo.name}`);

        // Reinicializar animations para animações básicas
        animations = filterAnimation(animInfo.name);

        if (animations) {
          if (
            (propType === 'text' && ['land', 'rise', 'slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'pop', 'implode', 'shake', 'shiver', 'spin'].includes(animInfo.name)) ||
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
            const fn = animations[animInfo.name];
            if (fn && typeof fn === 'function') {
              await fn(el, animInfo.arg);
              jk++;
            } else {
              macron('warn', `Função '${animInfo.name}' não encontrada na biblioteca`);
            }
          } else {
            macron('warn', `animação '${animInfo.name}' não é compatível com a propriedade '${propType}'.`);
          }
        } else {
          macron('warn', `Biblioteca de animações não foi inicializada para ${animInfo.name}`);
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