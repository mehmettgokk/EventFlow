<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

useSeoMeta({
  title: 'Favorilerim',
  description: 'Kaydettiğiniz ve takip etmek istediğiniz favori etkinlikleriniz.'
})

const favoritesStore = useFavoritesStore()
const favorites = computed(() => favoritesStore.favorites)
const hasFavorites = computed(() => favorites.value.length > 0)

const clearAll = () => {
  if (confirm('Tüm favori etkinliklerinizi listeden kaldırmak istediğinize emin misiniz?')) {
    favoritesStore.clearFavorites()
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Sayfa Başlığı ve Temizleme Butonu -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
          <span>Favorilerim</span>
          <UBadge
            v-if="hasFavorites"
            color="red"
            variant="subtle"
            size="lg"
            class="rounded-full"
          >
            {{ favorites.length }}
          </UBadge>
        </h1>
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Beğendiğiniz etkinlikleri burada saklayabilir ve dilediğiniz zaman bilet durumlarını kontrol edebilirsiniz.
        </p>
      </div>

      <UButton
        v-if="hasFavorites"
        color="red"
        variant="ghost"
        icon="i-heroicons-trash"
        label="Tümünü Temizle"
        @click="clearAll"
      />
    </div>

    <!-- Boş Durum -->
    <div
      v-if="!hasFavorites"
      class="text-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900/40"
    >
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
        <UIcon name="i-heroicons-heart" class="w-8 h-8" />
      </div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Henüz Favori Etkinliğiniz Yok</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2 mb-8">
        Keşfet veya Tüm Etkinlikler sayfasından ilgilendiğiniz konser ve gösterilerin üzerindeki kalp simgesine basarak buraya ekleyebilirsiniz.
      </p>
      <UButton
        to="/events"
        size="lg"
        color="primary"
        icon="i-heroicons-sparkles"
        label="Etkinlikleri Keşfet"
      />
    </div>

    <!-- Favori Etkinlik Kartları Listesi -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <EventCard
        v-for="item in favorites"
        :key="item.id"
        :event="item"
      />
    </div>
  </div>
</template>