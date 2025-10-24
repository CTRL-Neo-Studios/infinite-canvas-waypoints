<script setup lang="ts">
import type { JSONCanvasNode } from '../types/jsoncanvas'
import TextNode from './nodes/TextNode.vue'
import FileNode from './nodes/FileNode.vue'
import LinkNode from './nodes/LinkNode.vue'
import GroupNode from './nodes/GroupNode.vue'

const props = defineProps<{
  node: JSONCanvasNode
  isSelected: boolean
}>()

const emit = defineEmits<{
  'interaction-start': [event: PointerEvent]
}>()

const cursor = ref('grab')

const cursorClasses: Record<string, string> = {
  'top-left': 'cursor-nwse-resize',
  'top-right': 'cursor-nesw-resize',
  'bottom-left': 'cursor-nesw-resize',
  'bottom-right': 'cursor-nwse-resize',
  'top': 'cursor-ns-resize',
  'bottom': 'cursor-ns-resize',
  'left': 'cursor-ew-resize',
  'right': 'cursor-ew-resize',
  'grab': 'cursor-grab',
}

function updateCursor(event: PointerEvent) {
  if (!props.isSelected) {
    cursor.value = 'grab'
    return
  }
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const threshold = 8
  const onTop = y < threshold
  const onBottom = y > rect.height - threshold
  const onLeft = x < threshold
  const onRight = x > rect.width - threshold

  if (onTop && onLeft) cursor.value = 'top-left'
  else if (onTop && onRight) cursor.value = 'top-right'
  else if (onBottom && onLeft) cursor.value = 'bottom-left'
  else if (onBottom && onRight) cursor.value = 'bottom-right'
  else if (onTop) cursor.value = 'top'
  else if (onBottom) cursor.value = 'bottom'
  else if (onLeft) cursor.value = 'left'
  else if (onRight) cursor.value = 'right'
  else cursor.value = 'grab'
}
</script>

<template>
  <div
    :class="[props.isSelected ? 'ring-2 ring-offset-2 ring-offset-background border-primary shadow-lg' : 'ring-0 shadow-none', 'absolute border border-default select-none transition duration-100 ring-primary rounded-lg', cursorClasses[cursor]]"
    :style="{
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.width}px`,
      height: `${node.height}px`,
    }"
    @pointermove="updateCursor"
    @pointerdown="(e: PointerEvent) => emit('interaction-start', e)"
  >
    <TextNode v-if="node.type === 'text'" :node="node" :is-selected="isSelected" class="w-full h-full pointer-events-none" />
    <FileNode v-if="node.type === 'file'" :node="node" :is-selected="isSelected" class="w-full h-full pointer-events-none" />
    <LinkNode v-if="node.type === 'link'" :node="node" :is-selected="isSelected" class="w-full h-full pointer-events-none" />
    <GroupNode v-if="node.type === 'group'" :node="node" :is-selected="isSelected" class="w-full h-full pointer-events-none" />
  </div>
</template>
