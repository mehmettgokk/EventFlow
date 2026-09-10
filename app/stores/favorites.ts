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
      const stored = localStorage.getItem('favorites')
      if (stored) {
        try {
          favorites.value = JSON.parse(stored)
        } catch (e) {
          favorites.value = []
        }
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
    const toast = useToast()
    
    const index = favorites.value.findIndex(item => item.id === event.id)

    if (index > -1) {
      
      favorites.value.splice(index, 1)

      toast.add({
        title: 'Favorilerden Çıkarıldı',
        description: `"${event.name}" kaldırıldı.`,
        color: 'neutral',
        icon: 'i-heroicons-heart'
      })
    } else {
      
      favorites.value.push(event)

      toast.add({
        title: 'Favorilere Eklendi',
        description: `"${event.name}" kaydedildi.`,
        color: 'success',
        icon: 'i-heroicons-check-circle'
      })
    }

    
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
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