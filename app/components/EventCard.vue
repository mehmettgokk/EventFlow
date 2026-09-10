<script setup lang="ts">
import { computed } from 'vue'
import type { TicketmasterEvent } from '~/types/event'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{
  event: TicketmasterEvent
}>()

const favoritesStore = useFavoritesStore()

const isFav = computed(() => favoritesStore.isFavorite(props.event.id))

const coverImage = computed(() => {
  if (!props.event.images || props.event.images.length === 0) {
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'
  }
  const wideImg = props.event.images.find(img => img.ratio === '16_9' && img.width > 500)
  return wideImg ? wideImg.url : props.event.images[0].url
})

const formattedDate = computed(() => {
  const dateStr = props.event.dates?.start?.localDate
  if (!dateStr) return 'Tarih Belirtilmedi'
  
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

const venueInfo = computed(() => {
  const venue = props.event._embedded?.venues?.[0]
  if (!venue) return 'Mekan Belirtilmedi'
  const cityName = venue.city?.name
  return cityName ? `${venue.name}, ${cityName}` : venue.name
})

const categoryLabel = computed(() => {
  return props.event.classifications?.[0]?.segment?.name || 'Etkinlik'
})
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-500/50">
    <!-- Afiş Görseli Alanı -->
    <div class="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        :src="coverImage"
        :alt="event.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

      <!-- Kategori Rozeti -->
      <span class="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white border border-white/10">
        {{ categoryLabel }}
      </span>

      <!-- Favori Kalp Butonu -->
      <button
        type="button"
        class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/10"
        :aria-label="isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'"
        @click.stop.prevent="favoritesStore.toggleFavorite(event)"
      >
        <UIcon
          name="i-heroicons-heart-solid"
          class="h-5 w-5 transition-colors"
          :class="isFav ? 'text-red-500' : 'text-white/70 hover:text-white'"
        />
      </button>
    </div>

    <!-- İçerik Alanı -->
    <div class="flex flex-1 flex-col p-5">
      <!-- Tarih ve Mekan Bilgileri -->
      <div class="mb-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span class="flex items-center gap-1 font-medium text-primary-600 dark:text-primary-400">
          <UIcon name="i-heroicons-calendar" class="h-4 w-4" />
          {{ formattedDate }}
        </span>
        <span>•</span>
        <span class="flex items-center gap-1 truncate">
          <UIcon name="i-heroicons-map-pin" class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ venueInfo }}</span>
        </span>
      </div>

      <!-- Etkinlik Adı -->
      <h3 class="line-clamp-2 text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
        {{ event.name }}
      </h3>

      <!-- Detay Butonu -->
      <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60">
        <NuxtLink
          :to="`/events/${event.id}`"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all"
        >
          İncele
          <UIcon name="i-heroicons-arrow-right" class="h-3.5 w-3.5" />
        </NuxtLink>

        <a
          v-if="event.url"
          :href="event.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          Bilet Al
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="h-3 w-3" />
        </a>
      </div>
    </div>
  </div>
</template>