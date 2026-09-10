import { ref } from 'vue'

export interface CategoryOption {
  label: string
  value: string
}

export const useClassifications = () => {
    
  const config = useRuntimeConfig()
  const categories = ref<CategoryOption[]>([
    { label: 'Tümü', value: '' },
    { label: 'Müzik', value: 'Music' },
    { label: 'Spor', value: 'Sports' },
    { label: 'Sanat & Tiyatro', value: 'Arts & Theatre' },
    { label: 'Aile & Çocuk', value: 'Family' },
    { label: 'Film', value: 'Film' }
  ])

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  // kategorileri çeken fonksiyon
  const fetchClassifications = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<any>(
        `${config.public.ticketmasterBaseUrl}/classifications.json`,
        {
          query: {
            apikey: config.public.ticketmasterApiKey,
            size: 20
          }
        }
      )

      const apiSegments = response._embedded?.classifications
        ?.map((c: any) => c.segment)
        ?.filter(Boolean)
        ?.map((seg: any) => ({
          label: seg.name,
          value: seg.name
        })) || []

      if (apiSegments.length > 0) {
        categories.value = [{ label: 'Tümü', value: '' }, ...apiSegments]
      }
    } catch (err: any) {
      error.value = err?.message || 'Kategoriler yüklenemedi, varsayılanlar kullanılacak.'
    } finally {
      isLoading.value = false
    }
  }

  return { // dışa aktarılanlar
    categories,
    isLoading,
    error,
    fetchClassifications
  }
}