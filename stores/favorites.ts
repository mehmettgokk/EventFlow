import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TicketmasterEvent } from '../types/event'

// Pinia Store için Setup Store formatı
export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<TicketmasterEvent[]>([])
  const storageKey = 'eventflow_favorites'

  // LocalStorage'dan favorileri okuma
  const loadFavorites = () => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(storageKey)
        if (raw) favorites.value = JSON.parse(raw)
      } catch (e) {
        console.error('Favoriler yüklenirken hata:', e)
      }
    }
  }

  // LocalStorage'a yazma
  const saveFavorites = () => {
    if (typeof window !== 'undefined') { // tarayıcıda çalışması için
      try {
        localStorage.setItem(storageKey, JSON.stringify(favorites.value))
      } catch (e) {
        console.error('Favoriler kaydedilirken hata:', e)
      }
    }
  }


  const isFavorite = (eventId: string): boolean => {
    return favorites.value.some((item) => item.id === eventId)
  }

  const toggleFavorite = (event: TicketmasterEvent) => {
    const index = favorites.value.findIndex((item) => item.id === event.id)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(event)
    }
    saveFavorites()
  }

  if (typeof window !== 'undefined') {
    loadFavorites()
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    loadFavorites
  }
})