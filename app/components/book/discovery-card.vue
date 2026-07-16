<script setup lang="ts">
interface Props {
  id: string
  title: string
  author: string
  coverColor?: string
  rating: number
  reviews: number
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="`/books/${id}`"
    prefetch
    class="w-full max-w-[360px] bg-white rounded-3xl shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
  >
    <BookDiscoveryCover :title="title" :cover-color="coverColor" />

    <div class="text-center mt-2">
      <h3 class="text-[28px] font-semibold text-text-dark font-serif">
        {{ title }}
      </h3>
      <p class="text-muted mt-1">{{ author }}</p>
    </div>

    <BookDiscoveryRating :rating="rating" :reviews="reviews" />
  </NuxtLink>
</template>
