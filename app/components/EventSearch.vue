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

const handleSearch = () => {
  emit('update:modelValue', searchInput.value.trim())
  emit('search', searchInput.value.trim())
}

const handleClear = () => {
  searchInput.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="relative flex items-center w-full">
    <UInput
      v-model="searchInput"
      placeholder="Etkinlik, sanatçı veya grup ara..."
      icon="i-heroicons-magnifying-glass"
      size="lg"
      class="w-full"
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
  </form>
</template>