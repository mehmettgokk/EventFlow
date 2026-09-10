<script setup lang="ts">
import { computed } from 'vue'
import type { EventItem } from '~/types/event'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{
  event: EventItem
}>()

const favoritesStore = useFavoritesStore()

const isFav = computed(() => {
  return favoritesStore.isFavorite(props.event.id)
})

// Mavi varsayılanlar yerine en kaliteli ve doğru afişi seçen hesaplama
const eventImage = computed(() => {
  const images = props.event.images
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80'
  }

  // 1. Tercih: 600px ve üzeri 16:9 yatay afiş
  const wide = images.find(img => img.ratio === '16_9' && (img.width || 0) >= 600)
  if (wide) return wide.url

  // 2. Tercih: Herhangi bir 16:9 afiş
  const anyRatio = images.find(img => img.ratio === '16_9')
  if (anyRatio) return anyRatio.url

  // 3. Tercih: Çözünürlüğü en yüksek olan görsel
  const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0))
  return sorted[0]?.url || images[0].url
})

const formattedDate = computed(() => {
  const dateStr = props.event.dates?.start?.localDate
  if (!dateStr) return 'Tarih Belirtilmedi'
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

const venueName = computed(() => {
  return props.event._embedded?.venues?.[0]?.name || 'Mekan Belirtilmedi'
})
</script>

<template>
  <div class="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
    <!-- Kart Görsel Alanı -->
    <div class="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        :src="eventImage"
        :alt="event.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Favori Butonu -->
      <button
        type="button"
        class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-all hover:scale-110 active:scale-95 text-white"
        :aria-label="isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'"
        @click.stop="favoritesStore.toggleFavorite(event)"
      >
        <UIcon
          name="i-heroicons-heart-solid"
          class="h-5 w-5 transition-colors"
          :class="isFav ? 'text-red-500' : 'text-white/80 hover:text-white'"
        />
      </button>

      <!-- Kategori Rozeti -->
      <span
        v-if="event.classifications?.[0]?.segment?.name"
        class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10"
      >
        {{ event.classifications[0].segment.name }}
      </span>
    </div>

    <!-- İçerik Alanı -->
    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-primary-500" />
          {{ formattedDate }}
        </span>
        <span>•</span>
        <span class="flex items-center gap-1 truncate">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400" />
          {{ venueName }}
        </span>
      </div>

      <h3 class="font-bold text-base text-gray-900 dark:text-white line-clamp-2 mb-4 group-hover:text-primary-500 transition-colors">
        {{ event.name }}
      </h3>

      <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 text-sm">
        <NuxtLink
          :to="`/events/${event.id}`"
          class="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          İncele
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </NuxtLink>

        <a
          v-if="event.url"
          :href="event.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
        >
          Bilet Al
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
</template>