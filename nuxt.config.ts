// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
  ],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/auth/login",
      callback: "/confirm",
      exclude: ["/", "/auth/*", "/discover/explore"],
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
});
