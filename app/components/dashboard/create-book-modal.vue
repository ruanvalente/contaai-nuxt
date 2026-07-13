<script setup lang="ts">
import type { CreateBookPayload } from '~/types/dashboard'

interface Props {
  open: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const { createBook, updateBook, isCreating } = useUserBooks()
const toast = useToast()

const form = reactive<CreateBookPayload>({
  title: '',
  author: '',
  category: '',
  coverColor: '#8B4513',
  coverUrl: undefined,
})

const coverPreview = ref<string | null>(null)
const coverFile = ref<File | null>(null)

const handleSubmit = async () => {
  if (!form.title.trim()) {
    toast.error('Título é obrigatório')
    return
  }
  if (!form.author.trim()) {
    toast.error('Autor é obrigatório')
    return
  }
  if (!form.category) {
    toast.error('Selecione uma categoria')
    return
  }

  const book = await createBook(form)
  
  if (book && coverFile.value) {
    try {
      const formData = new FormData()
      formData.append('bookId', book.id)
      formData.append('file', coverFile.value)
      
      const { url } = await $fetch<{ url: string }>('/api/user/books/cover', {
        method: 'POST',
        body: formData,
      })
      
      updateBook(book.id, { cover_url: url })
    } catch (e) {
      console.error('Erro ao fazer upload da capa:', e)
      toast.info('Livro criado, mas houve erro ao enviar a capa. Você pode editá-lo depois.')
    }
  }

  if (book) {
    toast.success('Livro criado com sucesso!')
    resetForm()
    emit('created')
    emit('close')
  } else {
    toast.error('Erro ao criar livro')
  }
}

const handleCoverUpload = (file: File) => {
  coverFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleCoverRemove = () => {
  coverPreview.value = null
  coverFile.value = null
  form.coverUrl = undefined
}

const resetForm = () => {
  form.title = ''
  form.author = ''
  form.category = ''
  form.coverColor = '#8B4513'
  form.coverUrl = undefined
  coverPreview.value = null
  coverFile.value = null
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/50" @click="handleClose" />
        
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Novo Livro</h2>
            <button
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="handleClose"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form class="p-6 space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Capa</label>
              <DashboardUploadCover
                :preview="coverPreview"
                @upload="handleCoverUpload"
                @remove="handleCoverRemove"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cor da Capa</label>
              <DashboardCoverColorPicker v-model="form.coverColor" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Nome do livro"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Autor *</label>
              <input
                v-model="form.author"
                type="text"
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Nome do autor"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <DashboardCategorySelect v-model="form.category" />
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                @click="handleClose"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-accent-500 hover:bg-accent-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isCreating" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Criando...
                </span>
                <span v-else>Criar Livro</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
