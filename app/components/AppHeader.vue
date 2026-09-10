<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

const colorMode = useColorMode()
const favoritesStore = useFavoritesStore()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const favoriteCount = computed(() => favoritesStore.favorites.length)
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="p-2 rounded-xl bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
          <UIcon name="i-heroicons-ticket" class="w-6 h-6" />
        </div>
        <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Event<span class="text-primary-500">Flow</span>
        </span>
      </NuxtLink>

      
      <nav class="flex items-center gap-1 sm:gap-4">
        <UButton
          to="/"
          variant="ghost"
          color="gray"
          icon="i-heroicons-home"
          label="Keşfet"
          class="hidden sm:inline-flex"
        />

        <UButton
          to="/events"
          variant="ghost"
          color="gray"
          icon="i-heroicons-calendar"
          label="Tüm Etkinlikler"
          class="hidden sm:inline-flex"
        />

        <!-- Favoriler Butonu  -->
        <UButton
          to="/favorites"
          variant="ghost"
          color="gray"
          class="relative"
          aria-label="Favorilerim"
        >
          <UIcon name="i-heroicons-heart" class="w-5 h-5 text-red-500" />
          <span class="hidden sm:inline-block ml-1">Favoriler</span>
          <UBadge
            v-if="favoriteCount > 0"
            :value="favoriteCount"
            color="red"
            variant="solid"
            size="xs"
            class="ml-1.5 rounded-full px-1.5"
          >
            {{ favoriteCount }}
          </UBadge>
        </UButton>

        <div class="h-5 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

        <!-- Tema Değiştirici -->
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
            color="gray"
            variant="ghost"
            aria-label="Tema Değiştir"
            @click="isDark = !isDark"
          />
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </nav>
    </div>
  </header>
</template>