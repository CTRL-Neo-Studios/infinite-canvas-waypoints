<script setup lang="ts">
import type { JSONCanvasLinkNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasLinkNode
}>()
</script>

<template>
  <UCard>
    <a :href="node.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
      <UIcon name="i-lucide-link" class="w-6 h-6" />
      <span>{{ node.url }}</span>
    </a>
  </UCard>
</template>
