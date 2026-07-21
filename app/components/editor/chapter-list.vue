<script setup lang="ts">
import { useEditorStore } from "~/stores/editor-store"
import type { Chapter, EditorContent } from "~/types/editor"

const store = useEditorStore()

const chapters = computed(() => store.document?.chapters ?? [])
const activeChapterId = computed(() => store.activeChapter?.id)

const isCreating = ref(false)
const editingChapterId = ref<string | null>(null)
const editTitle = ref("")
const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function selectChapter(chapter: Chapter) {
  store.setActiveChapter(chapter)
}

function remapChapter(data: any): Chapter {
  return {
    id: data.id,
    documentId: data.document_id,
    title: data.title,
    content: data.content || { type: "doc", content: [{ type: "paragraph", content: [] }] },
    order: data.order,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

async function createChapter() {
  if (!store.documentId) return
  isCreating.value = true
  try {
    const data = await $fetch<{ success: boolean; chapter: any }>("/api/editor/chapter", {
      method: "POST",
      body: { documentId: store.documentId },
    })
    const newChapter = remapChapter(data.chapter)
    const updatedChapters = [...chapters.value, newChapter].sort((a, b) => a.order - b.order)
    if (store.document) {
      store.document = { ...store.document, chapters: updatedChapters }
    }
    selectChapter(newChapter)
  } finally {
    isCreating.value = false
  }
}

async function deleteChapter(chapterId: string) {
  if (chapters.value.length <= 1) return
  const previousChapters = chapters.value
  const previousActive = store.activeChapter
  const remaining = chapters.value.filter((ch) => ch.id !== chapterId)
  const reordered = remaining.map((ch, i) => ({ ...ch, order: i }))
  if (store.document) {
    store.document = { ...store.document, chapters: reordered }
  }
  if (store.activeChapter?.id === chapterId && reordered[0]) {
    selectChapter(reordered[0])
  }
  try {
    await $fetch(`/api/editor/chapter/${chapterId}`, { method: "DELETE" })
    await $fetch("/api/editor/chapters/reorder", {
      method: "PUT",
      body: { chapterIds: reordered.map((ch) => ch.id), documentId: store.documentId! },
    })
  } catch {
    if (store.document) {
      store.document = { ...store.document, chapters: previousChapters }
    }
    if (previousActive) {
      store.activeChapter = previousActive
    }
  }
}

function startEdit(chapter: Chapter) {
  editingChapterId.value = chapter.id
  editTitle.value = chapter.title
}

async function saveEdit(chapterId: string) {
  if (!editTitle.value.trim()) return
  await $fetch(`/api/editor/chapter/${chapterId}`, {
    method: "PUT",
    body: { title: editTitle.value.trim() },
  })
  const updated = chapters.value.map((ch) =>
    ch.id === chapterId ? { ...ch, title: editTitle.value.trim() } : ch
  )
  if (store.document) {
    store.document = { ...store.document, chapters: updated }
  }
  editingChapterId.value = null
  editTitle.value = ""
}

async function duplicateChapter(chapter: Chapter) {
  if (!store.documentId) return
  const data = await $fetch<{ success: boolean; chapter: any }>("/api/editor/chapter", {
    method: "POST",
    body: {
      documentId: store.documentId,
      title: `${chapter.title} (cópia)`,
      content: chapter.content,
      order: chapter.order + 1,
    },
  })
  const newChapter = remapChapter(data.chapter)
  const updatedChapters = [...chapters.value, newChapter].sort((a, b) => a.order - b.order)
  if (store.document) {
    store.document = { ...store.document, chapters: updatedChapters }
  }
}

function onDragStart(index: number) {
  draggingIndex.value = index
}

function onDragOver(index: number) {
  dragOverIndex.value = index
}

async function onDrop() {
  if (draggingIndex.value === null || dragOverIndex.value === null) return
  if (draggingIndex.value === dragOverIndex.value) return
  const previousChapters = chapters.value
  const reordered: Chapter[] = [...chapters.value]
  const moved = reordered.splice(draggingIndex.value, 1)[0]
  if (!moved) return
  reordered.splice(dragOverIndex.value, 0, moved)
  const ordered = reordered.map((ch, i) => ({ ...ch, order: i }))
  if (store.document) {
    store.document = { ...store.document, chapters: ordered }
  }
  try {
    await $fetch("/api/editor/chapters/reorder", {
      method: "PUT",
      body: { chapterIds: ordered.map((ch) => ch.id), documentId: store.documentId! },
    })
  } catch {
    if (store.document) {
      store.document = { ...store.document, chapters: previousChapters }
    }
  }
  draggingIndex.value = null
  dragOverIndex.value = null
}

function cancelEdit() {
  editingChapterId.value = null
  editTitle.value = ""
}
</script>

<template>
  <div class="chapter-list flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-3 border-b border-default">
      <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Capítulos
      </h3>
      <UButton
        icon="i-lucide-plus"
        size="xs"
        color="primary"
        variant="soft"
        :loading="isCreating"
        @click="createChapter"
      />
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="chapters.length === 0" class="p-4 text-center">
        <p class="text-sm text-muted-foreground">
          Nenhum capítulo ainda
        </p>
      </div>

      <ul class="divide-y divide-default">
        <li
          v-for="(chapter, index) in chapters"
          :key="chapter.id"
          :draggable="true"
          class="group relative"
          :class="{
            'opacity-50': draggingIndex === index,
            'border-t-2 border-primary': dragOverIndex === index,
          }"
          @dragstart="onDragStart(index)"
          @dragover.prevent="onDragOver(index)"
          @dragend="onDrop"
        >
          <button
            class="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3"
            :class="{ 'bg-primary/10 border-l-2 border-primary': activeChapterId === chapter.id }"
            @click="selectChapter(chapter)"
          >
            <UIcon name="i-lucide-grip-vertical" class="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />

            <div class="flex-1 min-w-0">
              <div v-if="editingChapterId === chapter.id" class="flex items-center gap-1">
                <UInput
                  v-model="editTitle"
                  size="sm"
                  class="flex-1"
                  @keydown.enter="saveEdit(chapter.id)"
                  @keydown.escape="cancelEdit"
                />
                <UButton icon="i-lucide-check" size="xs" color="primary" variant="ghost" @click="saveEdit(chapter.id)" />
                <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" @click="cancelEdit" />
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="text-sm truncate">{{ chapter.title }}</span>
                <span class="text-xs text-muted-foreground">{{ (chapter as any).word_count || 0 }} palavras</span>
              </div>
            </div>

            <div class="hidden group-hover:flex items-center gap-0.5">
              <UTooltip text="Renomear">
                <UButton
                  icon="i-lucide-pencil"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click.stop="startEdit(chapter)"
                />
              </UTooltip>
              <UTooltip text="Duplicar">
                <UButton
                  icon="i-lucide-copy"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click.stop="duplicateChapter(chapter)"
                />
              </UTooltip>
              <UTooltip text="Excluir">
                <UButton
                  icon="i-lucide-trash-2"
                  size="xs"
                  color="error"
                  variant="ghost"
                  :disabled="chapters.length <= 1"
                  @click.stop="deleteChapter(chapter.id)"
                />
              </UTooltip>
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
