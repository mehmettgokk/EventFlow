import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEvents } from '../../app/composables/useEvents'

describe('useEvents Composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks()

    ;(globalThis as any).useRuntimeConfig = vi.fn().mockReturnValue({
      public: {
        ticketmasterApiKey: 'test-api-key',
        ticketmasterBaseUrl: 'https://app.ticketmaster.com/discovery/v2'
      }
    })
  })

  it('başlangıç durumunda events boş dizi ve isLoading false olmalıdır', () => {
    const { events, isLoading, error } = useEvents()
    expect(events.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('API yanıt verdiğinde etkinlikler ve pageInfo güncellenmelidir', async () => {
    const mockApiResponse = {
      _embedded: {
        events: [
          { id: '1', name: 'Konser A' },
          { id: '2', name: 'Tiyatro B' }
        ]
      },
      page: {
        size: 12,
        totalElements: 50,
        totalPages: 5,
        number: 0
      }
    }

    ;(globalThis as any).$fetch = vi.fn().mockResolvedValue(mockApiResponse)

    const { events, pageInfo, fetchEvents } = useEvents()
    await fetchEvents({ page: 0, size: 12 })

    expect(events.value).toHaveLength(2)
    expect(events.value[0].name).toBe('Konser A')
    expect(pageInfo.value.totalPages).toBe(5)
    expect(pageInfo.value.totalElements).toBe(50)
  })

  it('API hatası durumunda error state dolmalı ve events temizlenmelidir', async () => {
    ;(globalThis as any).$fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { events, error, fetchEvents } = useEvents()
    await fetchEvents()

    expect(events.value).toEqual([])
    expect(error.value).toBeTruthy()
  })
})