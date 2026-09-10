<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { EventQueryParams } from '~/types/event'
import { useClassifications } from '~/composables/useClassifications'

const emit = defineEmits<{
  (e: 'filter', params: EventQueryParams): void
  (e: 'reset'): void
}>()

const { categories, fetchClassifications } = useClassifications()

const filters = reactive<EventQueryParams>({
  keyword: '',
  city: '',
  classificationName: '',
  sort: 'date,asc'
})

const sortOptions = [
  { label: 'Tarihe Göre (Önce En Yakın)', value: 'date,asc' },
  { label: 'Tarihe Göre (Önce En Uzak)', value: 'date,desc' },
  { label: 'İsme Göre (A-Z)', value: 'name,asc' },
  { label: 'İsme Göre (Z-A)', value: 'name,desc' }
]

const handleSearch = () => {
  emit('filter', { ...filters })
}

const handleReset = () => {
  filters.keyword = ''
  filters.city = ''
  filters.classificationName = ''
  filters.sort = 'date,asc'
  emit('reset')
}

// Kategorileri bileşen yüklendiğinde otomatik çekmek için 
fetchClassifications()
</script>

<template>
  <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
    <form @submit.prevent="handleSearch" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Anahtar Kelime araması -->
      <UFormGroup label="Etkinlik veya Sanatçı" name="keyword">
        <UInput
          v-model="filters.keyword"
          icon="i-heroicons-magnifying-glass"
          placeholder="Konser, festival, isim..."
          size="md"
        />
      </UFormGroup>

      <!-- Şehir arama -->
      <UFormGroup label="Şehir" name="city">
        <UInput
          v-model="filters.city"
          icon="i-heroicons-map-pin"
          placeholder="Örn: London, New York..."
          size="md"
        />
      </UFormGroup>

      <!-- Kategori Seçimi -->
      <UFormGroup label="Kategori" name="classification">
        <USelectMenu
          v-model="filters.classificationName"
          :options="categories"
          value-attribute="value"
          option-attribute="label"
          placeholder="Kategori seçin"
          size="md"
        />
      </UFormGroup>

      <!-- Sıralama Ölçütü -->
      <UFormGroup label="Sıralama" name="sort">
        <USelectMenu
          v-model="filters.sort"
          :options="sortOptions"
          value-attribute="value"
          option-attribute="label"
          size="md"
        />
      </UFormGroup>

      <div class="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-3 pt-2">
        <UButton
          type="button"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-path"
          label="Sıfırla"
          @click="handleReset"
        />
        <UButton
          type="submit"
          color="primary"
          icon="i-heroicons-funnel"
          label="Filtreleri Uygula"
        />
      </div>
    </form>
  </div>
</template>