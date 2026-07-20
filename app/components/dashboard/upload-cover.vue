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
const maxSize = 5 * 1024 * 1024

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
    <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleFileSelect" />

    <div v-if="preview" class="relative">
      <img :src="preview" alt="Preview da capa" class="w-full h-48 object-cover rounded-lg" />
      <UButton
        icon="i-lucide-x"
        color="error"
        size="xs"
        class="absolute top-2 right-2"
        @click="emit('remove')"
      />
    </div>

    <UButton
      v-else
      icon="i-lucide-image-plus"
      variant="outline"
      color="neutral"
      class="w-full h-48 flex-col gap-2 border-dashed"
      @click="triggerUpload"
    >
      <span class="text-sm font-medium">Clique para fazer upload</span>
      <span class="text-xs text-muted/70">JPEG, PNG ou WebP (máx. 5MB)</span>
    </UButton>
  </div>
</template>
