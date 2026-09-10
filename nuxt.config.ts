// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      ticketmasterApiKey: process.env.NUXT_PUBLIC_TICKETMASTER_API_KEY || '',
      ticketmasterBaseUrl: process.env.NUXT_PUBLIC_TICKETMASTER_BASE_URL || 'https://app.ticketmaster.com/discovery/v2'
    }
  },

  typescript: {
    strict: true
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark'
  }
})