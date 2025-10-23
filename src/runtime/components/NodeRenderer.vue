<script setup lang="ts">
import { computed } from 'vue'
import type { JSONCanvasNode } from '../types/jsoncanvas'
import TextNode from './nodes/TextNode.vue'
import FileNode from './nodes/FileNode.vue'
import LinkNode from './nodes/LinkNode.vue'
import GroupNode from './nodes/GroupNode.vue'

const props = defineProps<{
  node: JSONCanvasNode
  isSelected: boolean
}>()

const nodeComponent = computed(() => {
  switch (props.node.type) {
    case 'text':
      return TextNode
    case 'file':
      return FileNode
    case 'link':
      return LinkNode
    case 'group':
      return GroupNode
    default:
      return null
  }
})
</script>

<template>
  <div
    class="absolute select-none"
    :class="{ 'ring-2': isSelected, 'transition duration-200 ring-0 ring-primary rounded-lg': true }"
    :style="{
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.width}px`,
      height: `${node.height}px`,
    }"
  >
    <component :is="nodeComponent" v-if="nodeComponent" :node="node" class="w-full h-full" />
  </div>
</template>
