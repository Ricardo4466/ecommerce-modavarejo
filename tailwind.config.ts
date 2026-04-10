import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS v4: cores, tipografia, espaçamento, sombras e raios
 * ficam centralizados em `src/index.css` (`@theme`).
 *
 * Este arquivo cobre `content` para ferramentas e mantém a API de config
 * quando necessário.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
} satisfies Config
