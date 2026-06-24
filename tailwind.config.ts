import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          100: '#F5F0EB',
          200: '#EDE6DC',
          300: '#E0D6C8',
        },
        accent: {
          100: '#F0E6D8',
          500: '#C9A87C',
          600: '#B8956A',
          700: '#A07D5A',
        },
      },
    },
  },
} satisfies Config
