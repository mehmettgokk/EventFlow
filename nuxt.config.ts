export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      titleTemplate: '%s - EventFlow',
      title: 'EventFlow - Canlı Etkinlik Keşif Platformu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Konser, tiyatro, spor ve tüm canlı etkinlikleri keşfedin.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      ticketmasterApiKey: process.env.NUXT_PUBLIC_TICKETMASTER_API_KEY || '',
      ticketmasterBaseUrl: process.env.NUXT_PUBLIC_TICKETMASTER_BASE_URL || 'https://app.ticketmaster.com/discovery/v2'
    }
  },

  devtools: { enabled: true }
})