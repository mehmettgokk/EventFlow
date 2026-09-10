<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { EventQueryParams } from '~/types/event'
import { useEvents } from '~/composables/useEvents'

const { events, pageInfo, isLoading, error, fetchEvents } = useEvents()

const queryParams = reactive<EventQueryParams>({
  keyword: '',
  city: '',
  classificationName: '',
  sort: 'date,asc',
  page: 0,
  size: 12
})

const currentPage = ref(1)

const loadData = async (targetPage: number = 1) => {
  const pageNum = Number(targetPage) || 1
  currentPage.value = pageNum
  queryParams.page = Math.max(0, pageNum - 1)
  await fetchEvents({ ...queryParams })
}

const handleSearch = async (kw: string) => {
  queryParams.keyword = kw
  await loadData(1)
}

const handleFilter = async (filters: Partial<EventQueryParams>) => {
  Object.assign(queryParams, filters)
  await loadData(1)
}

const handleReset = async () => {
  queryParams.keyword = ''
  queryParams.city = ''
  queryParams.classificationName = ''
  queryParams.sort = 'date,asc'
  await loadData(1)
}

const handlePageChange = async (newPage: number) => {
  await loadData(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadData(1)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div>
      <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
        Tüm Etkinlikler
      </h1>
      <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        Konserlerden tiyatrolara binlerce canlı deneyimi keşfedin.
      </p>
    </div>

    <!-- Arama ve Filtreleme Bileşenleri -->
    <div class="space-y-4">
      <EventSearch @search="handleSearch" />
      <EventFilters @filter="handleFilter" @reset="handleReset" />
    </div>

    <!-- Hata Mesajı -->
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      title="Hata Oluştu"
      :description="error"
    />

    <!-- Liste Bileşeni (Loading ve Empty durumları dahil) -->
    <EventList
      :events="events"
      :loading="isLoading"
      @reset="handleReset"
    />

    <!-- Sayfalama -->
    <div
      v-if="pageInfo.totalPages > 1 && !isLoading"
      class="flex justify-center pt-8 border-t border-gray-200 dark:border-gray-800"
    >
      <UPagination
        :page="currentPage"
        :items-per-page="queryParams.size || 12"
        :total="pageInfo.totalElements"
        :sibling-count="1"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>