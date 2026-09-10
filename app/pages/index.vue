<script setup lang="ts">
import { onMounted } from 'vue'
import { useEvents } from '~/composables/useEvents'

const { events, isLoading, error, fetchEvents } = useEvents()

onMounted(async () => {
  const now = new Date().toISOString().split('.')[0] + 'Z'

  await fetchEvents({
    size: 8,
    sort: 'date,asc',
    startDateTime: now
  })
})
</script>

<template>
  <div>
    <section class="py-16 sm:py-24 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent text-center px-4">
      <div class="max-w-4xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-6">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
          Canlı Etkinlik Keşfi
        </span>
        <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
          Şehrindeki En İyi <span class="text-primary-500">Etkinlikleri</span> Yakala
        </h1>
        <p class="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8">
          Müzik festivallerinden tiyatro sahnelerine, spor müsabakalarından aile aktivitelerine kadar binlerce deneyim seni bekliyor.
        </p>
        <div class="flex items-center justify-center gap-4">
          <UButton
            to="/events"
            size="lg"
            color="primary"
            icon="i-heroicons-magnifying-glass"
            label="Tüm Etkinlikleri Keşfet"
          />
          <UButton
            to="/favorites"
            size="lg"
            variant="soft"
            color="gray"
            icon="i-heroicons-heart"
            label="Favorilerim"
          />
        </div>
      </div>
    </section>

    <!-- Yaklaşan Etkinlikler Bölümü -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Yaklaşan Etkinlikler
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            En yakın tarihte gerçekleşecek öne çıkan etkinlikler
          </p>
        </div>
        <UButton
          to="/events"
          variant="ghost"
          color="primary"
          trailing-icon="i-heroicons-arrow-right"
          label="Tümünü Gör"
        />
      </div>

      <!-- Hata Durumu -->
      <UAlert
        v-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        title="Etkinlikler Yüklenemedi"
        :description="error"
        class="mb-6"
      />

      <!-- Yükleniyor Durumu -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-4"
        >
          <USkeleton class="h-44 w-full rounded-xl" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-1/3" />
            <USkeleton class="h-6 w-full" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div
        v-else-if="!isLoading && events.length === 0"
        class="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800"
      >
        <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Henüz Etkinlik Yok</h3>
        <p class="text-sm text-gray-500 mt-1">Yaklaşan etkinlikler güncelleniyor.</p>
      </div>

      <!-- Liste -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <EventCard
          v-for="item in events"
          :key="item.id"
          :event="item"
        />
      </div>
    </section>
  </div>
</template>