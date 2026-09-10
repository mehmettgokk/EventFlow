<!-- app/app.vue -->
<script setup lang="ts">

</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">
      <AppHeader />

      <main class="flex-1">
        <NuxtPage />
      </main>

      <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center text-xs text-gray-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 EventFlow. Ticketmaster Discovery API ile güçlendirilmiştir.</p>
          <p>Nuxt 3 & Nuxt UI ile geliştirildi</p>
        </div>
      </footer>

    </div>
  </UApp>
</template>