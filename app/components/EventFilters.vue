<script setup lang="ts">
import { ref } from 'vue'
import type { EventQueryParams } from '~/types/event'

const emit = defineEmits<{
  (e: 'filter', filters: Partial<EventQueryParams>): void
  (e: 'reset'): void
}>()

const city = ref('')

// Kategori seçenekleri
const categoryOptions = [
  { label: 'Tüm Kategoriler', value: '' },
  { label: 'Müzik & Konser', value: 'Music' },
  { label: 'Spor', value: 'Sports' },
  { label: 'Sanat & Tiyatro', value: 'Arts & Theatre' },
  { label: 'Aile & Çocuk', value: 'Family' },
  { label: 'Film & Sinema', value: 'Film' }
]

// Sıralama seçenekleri
const sortOptions = [
  { label: 'Tarihe Göre (En Yakın)', value: 'date,asc' },
  { label: 'Tarihe Göre (En Uzak)', value: 'date,desc' },
  { label: 'İsme Göre (A-Z)', value: 'name,asc' },
  { label: 'İsme Göre (Z-A)', value: 'name,desc' }
]


const selectedCategory = ref(categoryOptions[0])
const selectedSort = ref(sortOptions[0])

const handleApply = () => {
  emit('filter', {
    city: city.value.trim(),
    classificationName: selectedCategory.value.value,
    sort: selectedSort.value.value
  })
}

const handleReset = () => {
  city.value = ''
  selectedCategory.value = categoryOptions[0]
  selectedSort.value = sortOptions[0]
  emit('reset')
}
</script>

<template>
  <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Şehir Filtresi -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Şehir
        </label>
        <UInput
          v-model="city"
          placeholder="Örn: Istanbul, London..."
          icon="i-heroicons-map-pin"
          size="md"
          class="w-full"
          @keydown.enter.prevent="handleApply"
        />
      </div>

      <!-- Kategori Seçim Menüsü -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Kategori
        </label>
        <USelectMenu
          v-model="selectedCategory"
          :items="categoryOptions"
          class="w-full"
          @change="handleApply"
        >
          <template #default="{ modelValue }">
            <span>{{ (modelValue as any)?.label || 'Seçiniz' }}</span>
          </template>
        </USelectMenu>
      </div>

      <!-- Sıralama Seçim Menüsü -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Sıralama
        </label>
        <USelectMenu
          v-model="selectedSort"
          :items="sortOptions"
          class="w-full"
          @change="handleApply"
        >
          <template #default="{ modelValue }">
            <span>{{ (modelValue as any)?.label || 'Seçiniz' }}</span>
          </template>
        </USelectMenu>
      </div>
    </div>

    <!-- Aksiyon Butonları -->
    <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-path"
        label="Temizle"
        @click="handleReset"
      />
      <UButton
        type="button"
        color="primary"
        icon="i-heroicons-funnel"
        label="Filtreleri Uygula"
        @click="handleApply"
      />
    </div>
  </div>
</template>