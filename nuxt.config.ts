// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@nuxt/ui",
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    theme: {
      colorMode: false,
      colors: {
        primary: 'primary',
        neutral: 'slate',
      },
    },
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/auth/login",
      callback: "/confirm",
      exclude: [
        "/",
        "/auth/*",
        "/discover/explore",
        "/discover/categories",
        "/discover/library",
        "/discover/downloads",
        "/discover/favorites",
        "/discover/settings",
        "/discover/books/*/editor",
      ],
    },
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      "Playfair Display": [600, 700],
      "Cormorant Garamond": [400, 600, 700],
    },
    display: "swap",
    preload: true,
    prefetch: true,
    download: true,
    inject: true,
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    typedPages: true,
  },
  vite: {
    optimizeDeps: {
      include: [
        "@nuxt/ui > prosemirror-state",
        "@nuxt/ui > prosemirror-transform",
        "@nuxt/ui > prosemirror-model",
        "@nuxt/ui > prosemirror-view",
        "@nuxt/ui > prosemirror-gapcursor",
      ],
    },
  },
});
