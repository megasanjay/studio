// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  alias: {},

  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
    },
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },

  css: ["@/assets/css/tailwind.css"],

  devtools: { enabled: true },

  imports: {
    dirs: ["stores"],
  },

  modules: [
    "@nuxt/devtools",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    [
      "nuxt-lodash",
      {
        prefix: "_",
      },
    ],
    "@pinia-plugin-persistedstate/nuxt",
    "@bg-dev/nuxt-naiveui",
    "nuxt-icon", // icons are found here: https://icones.js.org/
  ],

  naiveui: {
    colorModePreference: "light",
    iconSize: 18,
    themeConfig: {},
  },

  nitro: {},
});
