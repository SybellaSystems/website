import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'responsive-sm': 'clamp(12px, 2vw, 16px)',
        'responsive-md': 'clamp(16px, 3vw, 24px)',
        'responsive-lg': 'clamp(24px, 5vw, 32px)',
        'responsive-xl': 'clamp(32px, 6vw, 48px)',
      },
      fontSize: {
        'responsive-xs': 'clamp(11px, 1.2vw, 12px)',
        'responsive-sm': 'clamp(12px, 1.5vw, 14px)',
        'responsive-base': 'clamp(14px, 2vw, 16px)',
        'responsive-lg': 'clamp(16px, 2.5vw, 18px)',
        'responsive-xl': 'clamp(20px, 3vw, 24px)',
        'responsive-2xl': 'clamp(24px, 4vw, 32px)',
        'responsive-3xl': 'clamp(28px, 5vw, 48px)',
        'responsive-4xl': 'clamp(32px, 6vw, 56px)',
        'responsive-5xl': 'clamp(36px, 8vw, 76px)',
      },
    },
  },
  plugins: [],
};

export default config;