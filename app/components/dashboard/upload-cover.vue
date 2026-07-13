<script setup lang="ts">
interface Props {
  preview: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  upload: [file: File]
  remove: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const toast = useToast()

const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 5 * 1024 * 1024 // 5MB

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return

  if (!acceptedTypes.includes(file.type)) {
    toast.error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.')
    return
  }

  if (file.size > maxSize) {
    toast.error('Arquivo muito grande. Tamanho máximo: 5MB.')
    return
  }

  emit('upload', file)
  input.value = ''
}

const triggerUpload = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="handleFileSelect"
    />

    <div v-if="preview" class="relative">
      <img
        :src="preview"
        alt="Preview da capa"
        class="w-full h-48 object-cover rounded-lg"
      />
      <button
        type="button"
        class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        @click="emit('remove')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <button
      v-else
      type="button"
      class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-accent-500 hover:text-accent-500 transition-colors"
      @click="triggerUpload"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-sm font-medium">Clique para fazer upload</span>
      <span class="text-xs">JPEG, PNG ou WebP (máx. 5MB)</span>
    </button>
  </div>
</template>
