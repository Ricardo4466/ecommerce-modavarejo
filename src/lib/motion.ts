/** Curvas premium — desaceleração suave estilo produto alto padrão */
export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Deceleração “flutuante”; boa para reveals e UI editorial */
export const easePremium: [number, number, number, number] = [0.33, 1, 0.68, 1]

/** Springs mais relaxados = menos “snappy”, mais leveza */
export const springSnappy = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.85 }

export const springSoft = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.9 }

/** Hover de cards — lift quase imperceptível */
export const springFloat = { type: 'spring' as const, stiffness: 300, damping: 34, mass: 0.95 }

export const springBadge = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.8 }

export const springButton = { type: 'spring' as const, stiffness: 360, damping: 30, mass: 0.85 }

/** Só opacidade — `transform` no exit/enter quebra `background-attachment: fixed` no body e causa flashes de fundo. */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
