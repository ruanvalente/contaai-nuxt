<script setup lang="ts">
interface Props {
  icon: string;
  label: string;
  href: string;
  active: boolean;
}

const { active, icon } = defineProps<Props>();

const emit = defineEmits<{
  navigate: [];
}>();

function onClick() {
  emit('navigate');
}
</script>

<template>
  <UButton
    :to="href"
    :icon="icon"
    :color="active ? 'primary' : 'neutral'"
    :variant="active ? 'solid' : 'ghost'"
    :class="[
      'justify-start gap-4 px-6 py-4 rounded-2xl transition duration-200',
      active ? 'text-white' : 'text-accent hover:bg-white/10',
    ]"
    :ui="{ leadingIcon: 'w-5 h-5' }"
    @click="onClick"
  >
    <span class="font-medium text-sm">{{ label }}</span>
  </UButton>
</template>
