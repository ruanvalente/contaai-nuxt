<script setup lang="ts">
interface Props {
  rating: number
  reviews: number
}

defineProps<Props>()
</script>

<template>
  <SharedUiRatingStars :rating="rating" :reviews="reviews" :show-reviews="true" />
</template>
