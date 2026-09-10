<script setup lang="ts">

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - EventFlow` : 'EventFlow - Canlı Etkinlik Keşif Platformu'
  },
  meta: [
    { name: 'description', content: 'Konser, tiyatro, spor ve tüm canlı etkinlikleri keşfedin.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">

    <AppHeader />

    <main class="flex-1">
      <NuxtPage />
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center text-xs text-gray-500">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© EventFlow. Ticketmaster Discovery API Kullanılmıştır.</p>
        <p class="flex items-center gap-1">
          Nuxt 3 & Nuxt UI ile geliştirildi
        </p>
      </div>
    </footer>

    
    <UNotifications />
  </div>
</template>