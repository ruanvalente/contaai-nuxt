import type { Config } from "tailwindcss";

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Playfair Display", "serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        sidebar: "#34271C",
        "sidebar-hover": "#463427",
        primary: "#6A4A3A",
        accent: "#C8A97D",
        "book-bg": "#F7F4EF",
        "text-dark": "#2F241C",
        surface: "#FFFFFF",
        muted: "#6B7280",
        border: "#E5E7EB",
        // Keep existing primary-* and accent-* for backward compat
        "primary-100": "#F5F0EB",
        "primary-200": "#EDE6DC",
        "primary-300": "#E0D6C8",
        "accent-100": "#F0E6D8",
        "accent-500": "#C9A87C",
        "accent-600": "#B8956A",
        "accent-700": "#A07D5A",
      },
    },
  },
} satisfies Config;
