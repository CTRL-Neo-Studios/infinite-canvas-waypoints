<template>
  <div
    :id="id"
    data-jsonc-node
    class="jsonc-node absolute rounded-lg shadow ring-1 ring-inset bg-white/90 dark:bg-white/10"
    :class="[
      active ? 'ring-primary-500 shadow-lg' : 'ring-gray-200 dark:ring-gray-700',
    ]"
    :style="{
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.width}px`,
      height: `${node.height}px`,
      color: resolvedColor,
      borderColor: resolvedColor,
    }"
  >
    <div
      class="jsonc-node-header cursor-grab select-none text-gray-500 dark:text-gray-400 px-2 py-1 text-[11px] leading-4"
      @mousedown.prevent="onDragStart"
    >
      <span class="pointer-events-none">
        {{ headerText }}
      </span>
    </div>
    <div class="jsonc-node-content h-full overflow-auto px-3 pb-3">
      <component :is="contentComponent" v-model="contentText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { JSONCanvasNode } from '../types/jsoncanvas'
import MarkdownDisplay from './MarkdownDisplay.vue'

const props = defineProps<{
  id: string
  node: JSONCanvasNode
  active?: boolean
}>()
const emit = defineEmits<{
  (e: 'dragStart', ev: PointerEvent): void
  (e: 'dragBy', delta: { dx: number; dy: number }): void
  (e: 'dragEnd', ev: PointerEvent): void
}>()

const headerText = computed(() => {
  if (props.node.type === 'group' && props.node.label) return props.node.label
  if (props.node.type === 'link') return 'Link'
  if (props.node.type === 'file') return 'File'
  return 'Text'
})

const resolvedColor = computed(() => {
  const c = props.node.color
  if (!c) return 'currentColor'
  if (/^#|rgb|hsl/.test(c)) return c
  const map: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#eab308',
    '4': '#22c55e',
    '5': '#06b6d4',
    '6': '#a855f7',
  }
  return map[c] || 'currentColor'
})

const contentComponent = computed(() => {
  switch (props.node.type) {
    case 'text':
      return MarkdownDisplay
    case 'link':
      return {
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<a :href="modelValue" target="_blank" class="underline break-all">{{ modelValue }}</a>'
      } as any
    case 'file':
      return {
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<div class="text-xs text-gray-600 dark:text-gray-300 break-all">{{ modelValue }}</div>'
      } as any
    case 'group':
    default:
      return {
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<div class="text-xs text-gray-500 dark:text-gray-400">Group</div>'
      } as any
  }
})

const contentText = computed({
  get: () => {
    if (props.node.type === 'text') return props.node.text
    if (props.node.type === 'link') return props.node.url
    if (props.node.type === 'file') return props.node.file
    return ''
  },
  set: (v: string) => {
    if (props.node.type === 'text') (props.node as any).text = v
    else if (props.node.type === 'link') (props.node as any).url = v
    else if (props.node.type === 'file') (props.node as any).file = v
  }
})

const isDragging = ref(false)
let startX = 0
let startY = 0

function onDragStart(e: MouseEvent) {
  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  emit('dragStart', e as unknown as PointerEvent)
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}
function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  startX = e.clientX
  startY = e.clientY
  emit('dragBy', { dx, dy })
}
function onDragEnd(e: MouseEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  emit('dragEnd', e as unknown as PointerEvent)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}
</script>

<style scoped>
.jsonc-node {
  box-shadow: 0 0 0 2px rgba(0,0,0,0.03);
}
.jsonc-node-header { position: absolute; top: -1.75rem; left: 0; right: 0; }
.jsonc-node-content { padding-top: .5rem; }
</style>


