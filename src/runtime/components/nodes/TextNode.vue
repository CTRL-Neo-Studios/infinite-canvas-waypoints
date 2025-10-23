<script setup lang="ts">
import type { JSONCanvasTextNode } from '../../types/jsoncanvas'

defineProps<{
  node: JSONCanvasTextNode
}>()
</script>

<template>
  <UCard>
    <div class="prose dark:prose-invert">
      {{ node.text }}
    </div>
  </UCard>
</template>
