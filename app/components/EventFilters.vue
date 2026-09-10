<script setup lang="ts">
import { ref } from 'vue'
import type { EventQueryParams } from '~/types/event'

const emit = defineEmits<{
  (e: 'filter', filters: Partial<EventQueryParams>): void
  (e: 'reset'): void
}>()

const toast = useToast()
const dateError = ref<string | null>(null)

// Bugünün tarihi (Geçmiş gün seçimini tarayıcıda kilitlemek için)
const minSelectableDate = new Date().toISOString().split('T')[0]

// Serbest metin modelleri
const city = ref('')
const customCategory = ref('')
const specificDate = ref('')

// Öneri listeleri
const citySuggestions = [
  'Istanbul',
  'Ankara',
  'Izmir',
  'Bursa',
  'Antalya',
  'London',
  'Berlin',
  'Paris',
  'New York',
  'Los Angeles'
]

const categorySuggestions = [
  'Music',
  'Sports',
  'Arts & Theatre',
  'Family',
  'Film',
  'Rock',
  'Pop',
  'Jazz',
  'Classical'
]

const dateRangeOptions = [
  { label: 'Özel Gün Seç (Takvim)', value: 'custom' },
  { label: 'Tüm Tarihler', value: 'all' },
  { label: 'Bugün', value: 'today' },
  { label: 'Yarın', value: 'tomorrow' },
  { label: 'Bu Hafta Sonu', value: 'weekend' },
  { label: 'Bu Ay', value: 'month' }
]

const sortOptions = [
  { label: 'Tarihe Göre (En Yakın)', value: 'date,asc' },
  { label: 'Tarihe Göre (En Uzak)', value: 'date,desc' },
  { label: 'İsme Göre (A-Z)', value: 'name,asc' },
  { label: 'İsme Göre (Z-A)', value: 'name,desc' }
]

const selectedDateRange = ref(dateRangeOptions[1]) // Varsayılan: Tüm Tarihler
const selectedSort = ref(sortOptions[0])

const calculateDateRange = () => {
  if (selectedDateRange.value.value === 'custom' && specificDate.value) {
    const start = `${specificDate.value}T00:00:00Z`
    const end = `${specificDate.value}T23:59:59Z`
    return { startDateTime: start, endDateTime: end }
  }

  const now = new Date()
  let startDateTime = now.toISOString().split('.')[0] + 'Z'
  let endDateTime: string | undefined

  if (selectedDateRange.value.value === 'today') {
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    endDateTime = endOfDay.toISOString().split('.')[0] + 'Z'
  } else if (selectedDateRange.value.value === 'tomorrow') {
    const tomorrowStart = new Date(now)
    tomorrowStart.setDate(now.getDate() + 1)
    tomorrowStart.setHours(0, 0, 0, 0)
    startDateTime = tomorrowStart.toISOString().split('.')[0] + 'Z'

    const tomorrowEnd = new Date(tomorrowStart)
    tomorrowEnd.setHours(23, 59, 59, 999)
    endDateTime = tomorrowEnd.toISOString().split('.')[0] + 'Z'
  } else if (selectedDateRange.value.value === 'weekend') {
    const day = now.getDay()
    const diffToFriday = (5 - day + 7) % 7
    const friday = new Date(now)
    friday.setDate(now.getDate() + diffToFriday)
    friday.setHours(18, 0, 0, 0)

    const sunday = new Date(friday)
    sunday.setDate(friday.getDate() + 2)
    sunday.setHours(23, 59, 59, 999)

    startDateTime = friday.toISOString().split('.')[0] + 'Z'
    endDateTime = sunday.toISOString().split('.')[0] + 'Z'
  } else if (selectedDateRange.value.value === 'month') {
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    endDateTime = endOfMonth.toISOString().split('.')[0] + 'Z'
  }

  return { startDateTime, endDateTime }
}

const handleApply = () => {
  dateError.value = null

  // Geçmiş tarih kontrolü (Validation)
  if (selectedDateRange.value.value === 'custom' && specificDate.value) {
    const selected = new Date(specificDate.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selected < today) {
      dateError.value = 'Geçmiş bir tarih seçemezsiniz.'
      toast.add({
        title: 'Geçersiz Tarih',
        description: 'Lütfen bugünden sonraki bir tarihi seçiniz.',
        color: 'warning',
        icon: 'i-heroicons-calendar'
      })
      return
    }
  }

  const { startDateTime, endDateTime } = calculateDateRange()

  emit('filter', {
    city: city.value.trim(),
    classificationName: customCategory.value.trim(),
    sort: selectedSort.value.value,
    startDateTime,
    ...(endDateTime ? { endDateTime } : {})
  })
}

const handleReset = () => {
  city.value = ''
  customCategory.value = ''
  specificDate.value = ''
  dateError.value = null
  selectedDateRange.value = dateRangeOptions[1]
  selectedSort.value = sortOptions[0]
  emit('reset')
}
</script>

<template>
  <div class="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. Şehir -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Şehir
        </label>
        <UInput
          v-model="city"
          placeholder="Örn: Los Angeles, Bursa..."
          icon="i-heroicons-map-pin"
          list="city-suggestions"
          size="md"
          class="w-full"
          @keydown.enter.prevent="handleApply"
        />
        <datalist id="city-suggestions">
          <option v-for="c in citySuggestions" :key="c" :value="c" />
        </datalist>
      </div>

      <!-- 2. Kategori / Tür -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Kategori / Tür
        </label>
        <UInput
          v-model="customCategory"
          placeholder="Örn: Music, Rock, Sports..."
          icon="i-heroicons-tag"
          list="category-suggestions"
          size="md"
          class="w-full"
          @keydown.enter.prevent="handleApply"
        />
        <datalist id="category-suggestions">
          <option v-for="cat in categorySuggestions" :key="cat" :value="cat" />
        </datalist>
      </div>

      <!-- 3. Tarih Seçici / Hızlı Aralık -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Zaman / Tarih
        </label>

        <div class="space-y-2">
          <USelectMenu
            v-model="selectedDateRange"
            :items="dateRangeOptions"
            class="w-full"
            @change="handleApply"
          >
            <template #default="{ modelValue }">
              <span>{{ (modelValue as any)?.label || 'Tüm Tarihler' }}</span>
            </template>
          </USelectMenu>

          <!-- Özel gün takvimi -->
          <div v-if="selectedDateRange.value === 'custom'" class="space-y-1">
            <UInput
              v-model="specificDate"
              type="date"
              :min="minSelectableDate"
              :color="dateError ? 'error' : undefined"
              size="sm"
              class="w-full"
              @change="handleApply"
            />
            <p v-if="dateError" class="text-[11px] text-red-500 font-medium pl-1">
              {{ dateError }}
            </p>
          </div>
        </div>
      </div>

      <!-- 4. Sıralama -->
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
            <span>{{ (modelValue as any)?.label || 'Tarihe Göre' }}</span>
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