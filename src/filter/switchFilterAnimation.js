import { macron } from "../../console.js";
import { textAnimations } from "../../dist/src/anim/catalog/text/textAnimations.js";
import { colorAnimations } from "../anim/catalog/color/colorAnimations.js";
import { transformAnimations } from "../../dist/src/anim/catalog/transform/transform.js";
import { backgroundColor } from "../../dist/src/anim/catalog/background/color/backgroundColor.js";
import { backgroundImage } from "../../dist/src/anim/catalog/background/image/backgroundImage.js";
import { shadowAnimations } from "../../dist/src/anim/catalog/shadow/shadowAnimations.js";
import { radiusAnimations } from "../../dist/src/anim/catalog/radius/radiusAnimations.js";
import { gapAnimations } from "../../dist/src/anim/catalog/gap/gapAnimations.js";

export function filterAnimation(cleanName) {
    let animations;

    switch (cleanName) {
     case 'land': 
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
       animations = null;
    }

    return animations;
}