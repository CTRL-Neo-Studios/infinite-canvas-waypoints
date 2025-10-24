<script setup lang="ts">
import type { JSONCanvasFileNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasFileNode
  isSelected: boolean
}>()
</script>

<template>
  <div class="bg-default rounded-lg p-2 shadow-lg">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-file" class="w-6 h-6" />
      <span>{{ node.file }}</span>
    </div>
  </div>
</template>
