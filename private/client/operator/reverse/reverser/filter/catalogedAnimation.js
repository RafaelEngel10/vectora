import { textAnimations } from "../../../../../../dist/anim/catalog/text/textAnimations.js";
import macron from "../../../../../../src/basics.js";
import { reverseUncatalogedAnimation } from "./uncatalogedAnimation.js";

export function reversCatalogedAnimation(el, animName, arg) {
    switch (animName) {
      case 'fadeIn':
        textAnimations.fadeOut(el, arg);
        break;
      case 'fadeOut':
        textAnimations.fadeIn(el, arg);
        break;
      case 'slideIn':
        textAnimations.slideOut(el, arg);
        break;
      case 'slideOut':
        textAnimations.slideIn(el, arg);
        break;
      case 'rise':
        textAnimations.land(el, arg);
        break;
      case 'land':
        textAnimations.rise(el, arg);
        break;
      case 'pop':
        textAnimations.implode(el, arg);
        break;
      case 'implode':
        textAnimations.pop(el, arg)
        break;
      default:
        macron('debug', `Animação não catalogada, iniciando resolutor para ${animName}`);
        reverseUncatalogedAnimation(el, animName, arg);
        break;
    }
}