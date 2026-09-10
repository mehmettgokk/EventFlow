import { ref } from 'vue'
import type { 
  TicketmasterEvent, 
  EventsApiResponse, 
  EventQueryParams, 
  PageInfo 
} from '../types/event'

export const useEvents = () => {
  const config = useRuntimeConfig()
  
  // Reaktif durum değişkenleri
  const events = ref<TicketmasterEvent[]>([])
  const currentEvent = ref<TicketmasterEvent | null>(null)
  const pageInfo = ref<PageInfo>({
    size: 20,
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
      const response = await $fetch<EventsApiResponse>(
        `${config.public.ticketmasterBaseUrl}/events.json`,
        {
          query: {
            apikey: config.public.ticketmasterApiKey,
            size: params.size || 20,
            page: params.page || 0,
            sort: params.sort || 'date,asc',
            keyword: params.keyword || undefined,
            city: params.city || undefined,
            classificationName: params.classificationName || undefined,
            startDateTime: params.startDateTime || undefined
          }
        }
      )

      events.value = response._embedded?.events || []
      pageInfo.value = response.page || {
        size: 20,
        totalElements: 0,
        totalPages: 0,
        number: 0
      }
    } catch (err: any) {
      events.value = []
      error.value = err?.data?.message || err?.message || 'Etkinlikler yüklenirken bir hata oluştu.'
    } finally {
      isLoading.value = false
    }
  }

  // Tekil etkinlik detayını ID ile çekme
  const fetchEventById = async (id: string) => {
    isLoading.value = true
    error.value = null
    currentEvent.value = null

    try {
      const response = await $fetch<TicketmasterEvent>(
        `${config.public.ticketmasterBaseUrl}/events/${id}.json`,
        {
          query: {
            apikey: config.public.ticketmasterApiKey
          }
        }
      )

      currentEvent.value = response
      return response
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Etkinlik detayı alınamadı.'
      return null
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