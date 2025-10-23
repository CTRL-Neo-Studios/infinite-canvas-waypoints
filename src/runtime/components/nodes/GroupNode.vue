<script setup lang="ts">
import type { JSONCanvasGroupNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasGroupNode
}>()
</script>

<template>
  <div
    class="relative w-full h-full pointer-events-none"
    :style="{ 
      backgroundColor: node.background ? 'transparent' : node.color,
      backgroundImage: node.background ? `url(${node.background})` : 'none',
      backgroundSize: node.backgroundStyle === 'cover' ? 'cover' : (node.backgroundStyle === 'ratio' ? 'contain' : 'auto'),
      backgroundRepeat: node.backgroundStyle === 'repeat' ? 'repeat' : 'no-repeat',
    }"
  >
    <div class="absolute top-0 left-0 w-full border-t-2 border-dashed border-gray-400 dark:border-gray-600" />
    <div v-if="node.label" class="absolute -top-2 left-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1">
      {{ node.label }}
    </div>
  </div>
</template>
