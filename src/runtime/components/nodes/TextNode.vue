<script setup lang="ts">
import type { JSONCanvasTextNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasTextNode,
  isSelected: boolean
}>()
</script>

<template>
  <div>
    <div class="prose dark:prose-invert">
      {{ node.text }}
    </div>
  </div>
</template>
