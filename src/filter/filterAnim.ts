import { textAnimations } from "../catalog/text/textAnimations";
import { colorAnimations } from "../catalog/color/colorAnimations";
import { transformAnimations } from "../catalog/transform/transform";
import { gapAnimations } from "../catalog/gap/gapAnimations";
import { radiusAnimations } from "../catalog/radius/radiusAnimations";
import { shadowAnimations } from "../catalog/shadow/shadowAnimations";
import { backgroundColor } from "../catalog/background/color/backgroundColor";

// Retorna o objeto de animações que contém `animName`.
// Ordem de checagem: color -> text -> fallback (text)
export function filterAnim(animName: string) {
  if (animName in textAnimations) return textAnimations as any;
  if (animName in colorAnimations) return colorAnimations as any;
  if (animName in transformAnimations) return transformAnimations as any;
  if (animName in gapAnimations) return gapAnimations as any;
  if (animName in radiusAnimations) return radiusAnimations as any;
  if (animName in shadowAnimations) return shadowAnimations as any;
  if (animName in backgroundColor) return backgroundColor as any;
  return textAnimations as any;
}