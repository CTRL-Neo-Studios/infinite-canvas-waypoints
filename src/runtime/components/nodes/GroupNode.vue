<script setup lang="ts">
import type { JSONCanvasGroupNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasGroupNode
}>()
</script>

<template>
  <div
    class="relative w-full h-full"
    :style="{ 
      backgroundColor: node.background ? 'transparent' : node.color,
      backgroundImage: node.background ? `url(${node.background})` : 'none',
      backgroundSize: node.backgroundStyle === 'cover' ? 'cover' : (node.backgroundStyle === 'ratio' ? 'contain' : 'auto'),
      backgroundRepeat: node.backgroundStyle === 'repeat' ? 'repeat' : 'no-repeat',
    }"
  >
    <div v-if="node.label" class="absolute top-1 left-1 z-20 text-xs px-1 bg-default rounded-lg border-r border-default">
      {{ node.label }}
    </div>
  </div>
</template>

<style scoped>
@reference "../../styles/main.css";
</style>