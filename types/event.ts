
//afiş görseli bilgileri
export interface EventImage {
  ratio?: string
  url: string
  width: number
  height: number
  fallback?: boolean
}

// mekan bilgileri
export interface Venue {
  id: string
  name: string
  city?: { name: string }
  country?: { name: string; countryCode: string }
  address?: { line1?: string }
  location?: { longitude: string; latitude: string }
}

// Sahne alıcak sanatçı bilgileri
export interface Attraction {
  id: string
  name: string
  url?: string
  images?: EventImage[]
  classifications?: Classification[]
}

// kategoriler
export interface Classification {
  segment?: { id: string; name: string }
  genre?: { id: string; name: string }
  subGenre?: { id: string; name: string }
}

// bilet fiyat bilgileri
export interface PriceRange {
  type: string
  currency: string
  min: number
  max: number
}

// ana veri modeli
export interface TicketmasterEvent {
  id: string
  name: string
  url: string
  images: EventImage[]
  dates: {
    start: {
      localDate?: string
      localTime?: string
      dateTime?: string
    }
    status?: { code: string }
  }
  classifications?: Classification[]
  priceRanges?: PriceRange[]
  _embedded?: {
    venues?: Venue[]
    attractions?: Attraction[]
  }
}

// arama ve filtre parametreleri
export interface EventQueryParams {
  keyword?: string
  city?: string
  classificationName?: string
  startDateTime?: string
  sort?: string
  page?: number
  size?: number
}

// Sayfalama
export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}


export interface EventsApiResponse {
  _embedded?: {
    events: TicketmasterEvent[]
  }
  page: PageInfo
}