<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '~/composables/useEvents'
import { useFavoritesStore } from '~/stores/favorites'

const route = useRoute()
const eventId = route.params.id as string

const { currentEvent, isLoading, error, fetchEventById } = useEvents()
const favoritesStore = useFavoritesStore()

onMounted(async () => {
  if (eventId) {
    await fetchEventById(eventId)
  }
})

const isFav = computed(() => {
  return currentEvent.value ? favoritesStore.isFavorite(currentEvent.value.id) : false
})

const coverImage = computed(() => {
  if (!currentEvent.value?.images || currentEvent.value.images.length === 0) {
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'
  }
  const wideImg = currentEvent.value.images.find(img => img.ratio === '16_9' && img.width > 600)
  return wideImg ? wideImg.url : currentEvent.value.images[0].url
})

const formattedDate = computed(() => {
  const dateStr = currentEvent.value?.dates?.start?.localDate
  const timeStr = currentEvent.value?.dates?.start?.localTime
  if (!dateStr) return 'Tarih Belirtilmedi'
  
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  
  const formatted = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  })

  return timeStr ? `${formatted} - ${timeStr.slice(0, 5)}` : formatted
})

const venue = computed(() => currentEvent.value?._embedded?.venues?.[0])
const attractions = computed(() => currentEvent.value?._embedded?.attractions || [])
const priceRange = computed(() => currentEvent.value?.priceRanges?.[0])

useSeoMeta({
  title: () => currentEvent.value?.name ? `${currentEvent.value.name} Detayları` : 'Etkinlik Detayı',
  description: () => currentEvent.value?.name ? `${currentEvent.value.name} bilet ve mekan bilgileri.` : 'Etkinlik bilet ve mekan bilgileri.'
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Geri Dön Butonu -->
    <div class="mb-6">
      <UButton
        to="/events"
        variant="ghost"
        color="gray"
        icon="i-heroicons-arrow-left"
        label="Tüm Etkinliklere Dön"
      />
    </div>

    <!-- Yükleniyor Durumu  -->
    <div v-if="isLoading" class="space-y-6">
      <USkeleton class="h-80 w-full rounded-3xl" />
      <div class="space-y-4">
        <USkeleton class="h-8 w-2/3" />
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-32 w-full rounded-2xl" />
      </div>
    </div>

    <!-- Hata Durumu -->
    <UAlert
      v-else-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Etkinlik Bulunamadı"
      :description="error"
    />

    <!-- Etkinlik Detay Alanı -->
    <div v-else-if="currentEvent" class="space-y-8">
      <!-- Görsel ve Başlık Paneli -->
      <div class="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div class="relative aspect-[21/9] sm:aspect-[16/7] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            :src="coverImage"
            :alt="currentEvent.name"
            class="h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <!-- Favori Butonu -->
          <button
            type="button"
            class="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20"
            :aria-label="isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'"
            @click="favoritesStore.toggleFavorite(currentEvent)"
          >
            <UIcon
              name="i-heroicons-heart-solid"
              class="h-6 w-6 transition-colors"
              :class="isFav ? 'text-red-500' : 'text-white/70 hover:text-white'"
            />
          </button>
        </div>

        <div class="p-6 sm:p-8">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <UBadge
              v-if="currentEvent.classifications?.[0]?.segment?.name"
              color="primary"
              variant="subtle"
            >
              {{ currentEvent.classifications[0].segment.name }}
            </UBadge>
            <UBadge
              v-if="currentEvent.classifications?.[0]?.genre?.name"
              color="gray"
              variant="subtle"
            >
              {{ currentEvent.classifications[0].genre.name }}
            </UBadge>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {{ currentEvent.name }}
          </h1>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-center gap-2 font-medium text-primary-600 dark:text-primary-400">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
              <span>{{ formattedDate }}</span>
            </div>
            <div v-if="venue" class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-400" />
              <span>{{ venue.name }}, {{ venue.city?.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sanatçı, mekan, bilet -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sol Panel: Sanatçı ve Açıklama -->
        <div class="md:col-span-2 space-y-6">
          <!-- Sanatçılar / Katılımcılar -->
          <div v-if="attractions.length > 0" class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-primary-500" />
              Sanatçılar ve Katılımcılar
            </h2>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="artist in attractions"
                :key="artist.id"
                class="flex items-center gap-3 p-2 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50"
              >
                <img
                  v-if="artist.images?.[0]?.url"
                  :src="artist.images[0].url"
                  :alt="artist.name"
                  class="w-10 h-10 rounded-lg object-cover"
                />
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ artist.name }}</span>
              </div>
            </div>
          </div>

          <!-- Mekan Bilgileri -->
          <div v-if="venue" class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-building-office-2" class="w-5 h-5 text-primary-500" />
              Mekan Bilgisi
            </h2>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p class="font-semibold text-gray-900 dark:text-white text-base">{{ venue.name }}</p>
              <p v-if="venue.address?.line1">{{ venue.address.line1 }}</p>
              <p>{{ venue.city?.name }}, {{ venue.country?.name }}</p>
              <div v-if="venue.location" class="pt-3">
                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${venue.location.latitude},${venue.location.longitude}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  <UIcon name="i-heroicons-map" class="w-4 h-4" />
                  Google Haritalar'da Görüntüle
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Sağ Panel: Bilet ve Fiyat -->
        <div class="space-y-6">
          <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sticky top-24">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Bilet Bilgisi</h2>

            <div v-if="priceRange" class="mb-6">
              <span class="text-xs text-gray-500 block">Fiyat Aralığı</span>
              <span class="text-2xl font-black text-gray-900 dark:text-white">
                {{ priceRange.min }} - {{ priceRange.max }} {{ priceRange.currency }}
              </span>
            </div>

            <div class="space-y-3">
              <UButton
                v-if="currentEvent.url"
                :href="currentEvent.url"
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                color="primary"
                block
                icon="i-heroicons-ticket"
                label="Bilet Satın Al"
              />
              <UButton
                size="lg"
                variant="soft"
                :color="isFav ? 'red' : 'gray'"
                block
                :icon="isFav ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                :label="isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'"
                @click="favoritesStore.toggleFavorite(currentEvent)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>