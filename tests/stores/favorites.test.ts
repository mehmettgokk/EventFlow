import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from '../../app/stores/favorites'
import type { TicketmasterEvent } from '../../app/types/event'

const mockEvent = {
  id: 'ev-101',
  name: 'Rock Festival 2026',
  type: 'event',
  url: 'https://ticketmaster.com/event/101',
  locale: 'en-us',
  images: [
    {
      ratio: '16_9',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      width: 1024,
      height: 576,
      fallback: false
    }
  ],
  dates: {
    start: {
      localDate: '2026-10-15',
      localTime: '20:00:00'
    }
  }
} as TicketmasterEvent

describe('Favorites Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.restoreAllMocks()

    
    ;(globalThis as any).useToast = () => ({
      add: vi.fn()
    })
  })

  it('başlangıçta favoriler boş olmalıdır', () => {
    const store = useFavoritesStore()
    expect(store.favorites).toEqual([])
    expect(store.isFavorite('ev-101')).toBe(false)
  })

  it('etkinlik toggleFavorite ile listeye eklenmelidir', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(mockEvent)

    expect(store.favorites.length).toBe(1)
    expect(store.favorites[0].id).toBe('ev-101')
    expect(store.isFavorite('ev-101')).toBe(true)
  })

  it('listede olan etkinlik toggleFavorite ile çıkarılmalıdır', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(mockEvent)
    expect(store.favorites.length).toBe(1)

    store.toggleFavorite(mockEvent)
    expect(store.favorites.length).toBe(0)
    expect(store.isFavorite('ev-101')).toBe(false)
  })

  it('değişiklikler localStorage üzerine kaydedilmelidir', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(mockEvent)

    const stored = localStorage.getItem('favorites')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe('ev-101')
  })
})