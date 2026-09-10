<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TicketmasterEvent } from '~/types/event'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{
  event: TicketmasterEvent
}>()

const favoritesStore = useFavoritesStore()
const isConfirmOpen = ref(false)


const eventImage = computed(() => {
  if (!props.event.images || props.event.images.length === 0) {
    return 'https://placehold.co/600x400/18181b/ffffff?text=Etkinlik+Görseli+Yok'
  }
  const ratio169 = props.event.images.find(img => img.ratio === '16_9' && img.width >= 600)
  return ratio169?.url || props.event.images[0].url
})


const formattedDate = computed(() => {
  const dateStr = props.event.dates?.start?.localDate
  const timeStr = props.event.dates?.start?.localTime
  if (!dateStr) return 'Tarih Belirtilmemiş'

  try {
    const d = new Date(dateStr)
    const formatted = d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    return timeStr ? `${formatted} • ${timeStr.slice(0, 5)}` : formatted
  } catch {
    return dateStr
  }
})

// Mekan ve Şehir bilgisi
const venueInfo = computed(() => {
  const venues = props.event._embedded?.venues
  if (!venues || venues.length === 0) return 'Mekan Belirtilmemiş'
  const v = venues[0]
  const city = v.city?.name
  const name = v.name
  if (city && name) return `${name}, ${city}`
  return name || city || 'Mekan Belirtilmemiş'
})

// Kategori adı
const genreName = computed(() => {
  return props.event.classifications?.[0]?.genre?.name ||
    props.event.classifications?.[0]?.segment?.name ||
    'Etkinlik'
})

// Favori buton etkileşimi
const handleFavoriteClick = () => {
  if (favoritesStore.isFavorite(props.event.id)) {
    isConfirmOpen.value = true
  } else {
    favoritesStore.toggleFavorite(props.event)
  }
}

const confirmRemove = () => {
  favoritesStore.toggleFavorite(props.event)
  isConfirmOpen.value = false
}
</script>

<template>
  <div>
    <div class="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      <div class="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          :src="eventImage"
          :alt="event.name"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <!-- Kategori Rozeti -->
        <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-black/60 text-white backdrop-blur-md">
          {{ genreName }}
        </span>

        <!-- Favori Butonu -->
        <div class="absolute top-3 right-3">
          <UButton
            :icon="favoritesStore.isFavorite(event.id) ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            :color="favoritesStore.isFavorite(event.id) ? 'error' : 'neutral'"
            variant="subtle"
            size="sm"
            class="rounded-full cursor-pointer shadow-sm"
            aria-label="Favorilere ekle veya çıkar"
            @click.stop.prevent="handleFavoriteClick"
          />
        </div>
      </div>

      <!-- Bilgi Alanı -->
      <div class="flex flex-col flex-1 p-5 justify-between gap-4">
        <div class="space-y-2">
          <!-- Tarih -->
          <div class="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4 shrink-0" />
            <span>{{ formattedDate }}</span>
          </div>

          <!-- Başlık -->
          <NuxtLink :to="`/events/${event.id}`" class="block">
            <h3 class="font-bold text-gray-900 dark:text-white text-base line-clamp-2 hover:text-primary-500 transition-colors">
              {{ event.name }}
            </h3>
          </NuxtLink>

          <!-- Mekan -->
          <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ venueInfo }}</span>
          </div>
        </div>

        <!-- Detay Butonu -->
        <div class="pt-2 border-t border-gray-100 dark:border-gray-800/60">
          <UButton
            :to="`/events/${event.id}`"
            variant="ghost"
            color="primary"
            size="sm"
            trailing-icon="i-heroicons-arrow-right"
            block
          >
            Detayları İncele
          </UButton>
        </div>
      </div>
    </div>

    <!-- Favoriden Çıkarma Onay Modalı -->
    <UModal v-model:open="isConfirmOpen">
      <template #content>
        <div class="p-6 space-y-4 text-left">
          <div class="flex items-center gap-3 text-amber-500">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-7 h-7 shrink-0" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Favorilerden Kaldırılsın mı?
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300">
            <strong>{{ event.name }}</strong> etkinliğini favoriler listenizden çıkarmak istediğinizden emin misiniz?
          </p>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              label="Vazgeç"
              color="neutral"
              variant="ghost"
              @click="isConfirmOpen = false"
            />
            <UButton
              label="Evet, Kaldır"
              color="error"
              @click="confirmRemove"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>