import { textAnimations } from "../catalog/text/textAnimations";

export function filterAnim(animName: string) {
  // Por enquanto, retorna apenas textAnimations
  // Futuro: adicionar suporte para outras categorias como colorAnimations, transformAnimations, etc
  return textAnimations;
}