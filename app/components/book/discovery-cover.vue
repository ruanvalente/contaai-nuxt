<script setup lang="ts">
interface Props {
  title: string
  coverColor?: string
}

withDefaults(defineProps<Props>(), {
  coverColor: '#6A4A3A',
})
</script>

<template>
  <div
    class="w-[190px] h-[290px] rounded-2xl flex flex-col items-center justify-center p-4 relative"
    :style="{ backgroundColor: coverColor }"
  >
    <span class="text-[#EFE6E2] font-serif text-center text-lg leading-tight">
      {{ title }}
    </span>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-px bg-[#EFE6E2]/40" />
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-px bg-[#EFE6E2]/60" />
  </div>
</template>
