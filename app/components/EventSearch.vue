<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', keyword: string): void
}>()

const searchInput = ref(props.modelValue || '')

const toast = useToast()
const errorMessage = ref<string | null>(null)

const handleSearch = () => {
  const query = searchInput.value.trim()

  // 1. Boş sorgu kontrolü
  if (!query) {
    errorMessage.value = 'Lütfen aramak istediğiniz kelimeyi giriniz.'
    toast.add({
      title: 'Arama Boş Olamaz',
      description: 'Lütfen bir etkinlik veya sanatçı adı yazın.',
      color: 'warning',
      icon: 'i-heroicons-exclamation-circle'
    })
    return
  }

  // 2. Minimum 2 karakter kontrolü
  if (query.length < 2) {
    errorMessage.value = 'Lütfen en az 2 karakter giriniz.'
    toast.add({
      title: 'Geçersiz Arama',
      description: 'Arama yapabilmek için en az 2 karakter girmelisiniz.',
      color: 'warning',
      icon: 'i-heroicons-exclamation-circle'
    })
    return
  }

  errorMessage.value = null
  emit('update:modelValue', query)
  emit('search', query)
}

const handleClear = () => {
  searchInput.value = ''
  errorMessage.value = null
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="w-full space-y-1">
    <UInput
      v-model="searchInput"
      placeholder="Etkinlik, sanatçı veya grup ara..."
      icon="i-heroicons-magnifying-glass"
      size="lg"
      class="w-full"
      :color="errorMessage ? 'error' : undefined"
      @input="errorMessage = null"
    >
      <template #trailing>
        <div class="flex items-center gap-1.5">
          <UButton
            v-if="searchInput"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="xs"
            aria-label="Temizle"
            @click="handleClear"
          />
          <UButton
            type="submit"
            color="primary"
            size="xs"
            label="Ara"
          />
        </div>
      </template>
    </UInput>
    <p v-if="errorMessage" class="text-xs text-red-500 font-medium pl-1">
      {{ errorMessage }}
    </p>
  </form>
</template>