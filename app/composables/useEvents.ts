import { ref } from 'vue'
import type { TicketmasterEvent, EventQueryParams, PageInfo } from '~/types/event'


interface DiscoveryApiResponse {
  _embedded?: {
    events?: TicketmasterEvent[]
  }
  page?: PageInfo
}

export const useEvents = () => {
  const config = useRuntimeConfig()
  const apiKey = config.public.ticketmasterApiKey
  const baseUrl = config.public.ticketmasterBaseUrl

  const events = ref<TicketmasterEvent[]>([])
  const currentEvent = ref<TicketmasterEvent | null>(null)
  const pageInfo = ref<PageInfo>({
    size: 12,
    totalElements: 0,
    totalPages: 0,
    number: 0
  })

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Çoklu etkinlik listesi çekme (arama, filtreleme, sayfalama)
  const fetchEvents = async (params: EventQueryParams = {}) => {
    isLoading.value = true
    error.value = null

    try {
      // Geçmiş etkinlikleri elemek için 
      const nowIso = new Date().toISOString().split('.')[0] + 'Z'

      // sayfa numarası 
      const targetPage = Number(params.page) || 0

      const query: Record<string, any> = {
        apikey: apiKey,
        size: params.size || 12,
        page: targetPage,
        sort: params.sort || 'date,asc',
        startDateTime: params.startDateTime || nowIso
      }

      if (params.keyword?.trim()) query.keyword = params.keyword.trim()
      if (params.city?.trim()) query.city = params.city.trim()
      if (params.classificationName?.trim()) query.classificationName = params.classificationName.trim()

      const data = await $fetch<DiscoveryApiResponse>(`${baseUrl}/events.json`, { query })

      events.value = data._embedded?.events || []
      pageInfo.value = {
        size: data.page?.size || 12,
        totalElements: data.page?.totalElements || 0,
        totalPages: data.page?.totalPages || 0,
        number: data.page?.number || 0
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Etkinlikler yüklenirken bir hata oluştu.'
      events.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Tekil etkinlik detayını çekme
  const fetchEventById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<TicketmasterEvent>(`${baseUrl}/events/${id}.json`, {
        query: { apikey: apiKey }
      })
      currentEvent.value = response
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Etkinlik detayı bulunamadı.'
      currentEvent.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    events,
    currentEvent,
    pageInfo,
    isLoading,
    error,
    fetchEvents,
    fetchEventById
  }
}