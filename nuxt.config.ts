// Nuxt config file
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["vuetify-nuxt-module", "@vite-pwa/nuxt"],

  imports: {
    presets: [
      {
        from: "vue-i18n",
        imports: ["useI18n"],
      },
      {
        from: "vuetify",
        imports: ["useDisplay"],
      },
      {
        from: "firebase/database",
        imports: [
          "onValue",
          "set",
          "update",
          "push",
          ["ref", "dbRef"],
          "DataSnapshot",
        ],
      },
      {
        from: "firebase/storage",
        imports: ["getDownloadURL", "uploadBytes", ["ref", "sRef"]],
      },
      {
        from: "firebase/auth",
        imports: ["getAuth"],
      },
    ],
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  compatibilityDate: "2024-07-04",
});
