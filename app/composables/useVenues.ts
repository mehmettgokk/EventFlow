// composables/useVenues.ts
import { ref } from 'vue'
import type { Venue } from '../types/event'

export const useVenues = () => {
  const config = useRuntimeConfig()
  const venues = ref<Venue[]>([])
  const currentVenue = ref<Venue | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // mekan arama 
  const searchVenues = async (keyword: string) => {
    if (!keyword || keyword.trim().length < 2) { // 2 harf tabanı 
      venues.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>(
        `${config.public.ticketmasterBaseUrl}/venues.json`,
        {
          query: {
            apikey: config.public.ticketmasterApiKey,
            keyword: keyword.trim(),
            size: 10
          }
        }
      )

      venues.value = response._embedded?.venues || []
    } catch (err: any) {
      venues.value = []
      error.value = err?.message || 'Mekanlar aranırken bir hata oluştu.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchVenueById = async (id: string) => {
    isLoading.value = true
    error.value = null
    currentVenue.value = null

    try {
      const response = await $fetch<Venue>(
        `${config.public.ticketmasterBaseUrl}/venues/${id}.json`,
        {
          query: {
            apikey: config.public.ticketmasterApiKey
          }
        }
      )

      currentVenue.value = response
      return response
    } catch (err: any) {
      error.value = err?.message || 'Mekan detayları alınamadı.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    venues,
    currentVenue,
    isLoading,
    error,
    searchVenues,
    fetchVenueById
  }
}