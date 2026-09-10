# EventFlow

Ticketmaster Discovery API v2 kullanan, Nuxt 3 tabanlı etkinlik arama, filtreleme ve favori yönetim platformu.

## Özellikler

* **Arama & Validasyon:** Anahtar kelime ile arama, boş arama uyarısı ve 2 karakter altı anlık doğrulama kontrolleri.
* **Şehir Filtreleme:** Öneri listesinden seçim yapabilme veya serbest metin olarak herhangi bir şehri aratabilme.
* **Kategori Filtreleme:** Müzik, spor, tiyatro gibi ana kategorilerin yanı sıra serbest tür/alt tür girişi.
* **Tarih & Zaman Filtreleri:** "Bugün", "Yarın", "Bu Hafta Sonu", "Bu Ay" gibi hızlı seçenekler ile takvimden özel gün belirleme.
* **Tarih Doğrulaması:** Geçmiş gün seçimini tarayıcı takviminde kilitleme ve geçmiş tarih girildiğinde inline ve bildirim uyarısı fırlatma.
* **Sıralama Seçenekleri:** Tarihe ve etkinlik adına göre artan/azalan sıralama.
* **Favori Yönetimi:** Pinia store ile global favori durumu ve tarayıcı oturumları arasında kaybolmayan LocalStorage senkronizasyonu.
* **Etkileşim Güvenliği (Onay Modalı):** Bir etkinliği favorilerden çıkarırken kazara silinmeleri önleyen onay diyaloğu.
* **Kullanıcı Bildirimleri:** Favoriye ekleme, çıkarma ve doğrulama hatalarında anlık Toast mesajları.
* **Dinamik Detay Sayfaları:** `/events/[id]` rotası altında görsel galerisi, tarih/saat, mekan ve harici bilet satın alma bağlantıları.
* **Sayfalama & Yükleme Durumları:** Sayfa bazlı veri akışı, skeleton yükleme animasyonları ve sonuç bulunamadı uyarıları.
* **Birim Testleri:** Vitest ile `favorites` store'u ve `useEvents` composable'ı için test kapsamı.

## Teknolojiler

* Nuxt 3 & Vue 3 (Composition API, `<script setup>`)
* Nuxt UI & Tailwind CSS
* Pinia
* TypeScript
* Vitest & Happy-DOM
* Ticketmaster Discovery API v2

## Kurulum ve Çalıştırma

1. Proje bağımlılıklarını yükleyin:
```bash
npm install
```

2. Kök dizinde .env dosyasını oluşturup API anahtarınızı tanımlayın:
```bash
TICKETMASTER_API_KEY=your_api_key_here
TICKETMASTER_BASE_URL=[https://app.ticketmaster.com/discovery/v2](https://app.ticketmaster.com/discovery/v2)
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Birim testlerini çalıştırın:
```bash
npm run test
```


## Proje Yapısı

```text
EventFlow/
├── app/
│   ├── components/                     # Kullanıcı arayüzü bileşenleri
│   │   ├── EventCard.vue               # Etkinlik kartı, detay linki ve favori butonu/onay modalı
│   │   ├── EventFilters.vue            # Şehir, kategori, esnek tarih ve sıralama filtreleri
│   │   └── EventSearch.vue             # Arama çubuğu bileşeni
│   ├── composables/                    # Yeniden kullanılabilir API ve iş mantığı
│   │   ├── useClassifications.ts       # Ticketmaster kategori/sınıflandırma verilerini getiren composable
│   │   ├── useEvents.ts                # Etkinlik listeleme, filtreleme, arama ve sayfalama yönetimi
│   │   └── useVenues.ts                # Mekan verilerini yöneten composable
│   ├── pages/                          # Nuxt otomatik dosya tabanlı yönlendirmeleri
│   │   ├── events/
│   │   │   └── [id].vue                # Etkinlik detay sayfası (mekan, tarih, harita ve bilet al butonu)
│   │   ├── favorites.vue               # Kullanıcının favoriye aldığı etkinliklerin listelendiği sayfa
│   │   └── index.vue                   # Ana sayfa (arama, filtreler, grid liste ve sayfalama)
│   ├── stores/                         # Global durum yönetimi
│   │   └── favorites.ts                # LocalStorage senkronizasyonlu Pinia favori store'u
│   ├── types/                          # TypeScript veri modelleri
│   │   └── event.ts                    # Ticketmaster API yanıtları ve sorgu parametreleri tip tanımları
│   ├── app.vue                         # Kök uygulama şablonu (header, footer ve layout sarmalayıcı)
│   └── router.options.ts               # Sayfa geçişleri ve scroll davranışı yapılandırması
├── tests/                              # Birim testleri suite
│   ├── composables/
│   │   └── useEvents.test.ts           # useEvents API çağrısı, sayfalama ve hata durumları testleri
│   └── stores/
│       └── favorites.test.ts           # Store ekleme, çıkarma, localStorage ve duplicate kontrol testleri
├── public/                             # Statik dosyalar ve favicon
├── .env                                # Ortam değişkenleri (API anahtarları)
├── nuxt.config.ts                      # Nuxt 3 modül, runtime config ve genel proje ayarları
├── package.json                        # Bağımlılıklar ve npm scriptleri
├── tsconfig.json                       # TypeScript yapılandırması
└── vitest.config.ts                    

```