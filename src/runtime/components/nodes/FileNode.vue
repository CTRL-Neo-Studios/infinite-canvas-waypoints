<script setup lang="ts">
import type { JSONCanvasFileNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasFileNode
}>()
</script>

<template>
  <UCard>
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-file" class="w-6 h-6" />
      <span>{{ node.file }}</span>
    </div>
  </UCard>
</template>
