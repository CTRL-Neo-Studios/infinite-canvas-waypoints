<template>
  <div class="prose prose-sm dark:prose-invert max-w-none">
    <textarea
      v-model="local"
      class="w-full h-24 resize-y rounded border border-gray-200 dark:border-gray-700 bg-transparent p-2 text-xs"
    />
    <div class="mt-2 text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap wrap-break-word">
      {{ local }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string | undefined }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const local = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
})
</script>


