// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
