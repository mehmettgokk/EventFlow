<script setup lang="ts">
import type { TicketmasterEvent } from '~/types/event'

defineProps<{
  events: TicketmasterEvent[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()
</script>

<template>
  <div>
    <!-- 1. Yükleniyor Durumu  -->
    <div
      v-if="loading"
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

    <!-- 2. Sonuç Bulunamadı Durumu -->
    <div
      v-else-if="events.length === 0"
      class="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900/40"
    >
      <UIcon name="i-heroicons-face-frown" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Etkinlik Bulunamadı</h3>
      <p class="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
        Arama kriterlerinize veya seçilen filtrelere uygun aktif bir etkinlik kaydı mevcut değil.
      </p>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-arrow-path"
        label="Filtreleri Sıfırla"
        @click="emit('reset')"
      />
    </div>

    <!-- 3. Etkinlik Listesi -->
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
  </div>
</template>