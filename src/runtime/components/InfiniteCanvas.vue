<script setup lang="ts">
import { shallowRef, computed, ref, watch } from 'vue'
import { useInfiniteCanvas } from '../composables/useInfiniteCanvas'

const viewportRef = shallowRef<HTMLDivElement | null>(null)

// -- Grid --
const gridSpacing = ref(24) // world units
const dotColor = ref('rgba(148, 163, 184, 0.35)') // slate-400/50

// -- Canvas Logic --
const {
  scale,
  translate,
  selectionRect,
  transformStyle,
  isPanning,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
} = useInfiniteCanvas({ minScale: 0.25, maxScale: 5 })

const cssVars = computed(() => {
  return {
    '--scale': String(scale.value),
    '--tx': `${translate.value.x}px`,
    '--ty': `${translate.value.y}px`,
    '--grid-size': `${gridSpacing.value * scale.value}px`,
    '--grid-pos-x': `${translate.value.x}px`,
    '--grid-pos-y': `${translate.value.y}px`,
    '--dot-color': dotColor.value,
  } as Record<string, string>
})

function setCursor(value: string) {
  if (viewportRef.value) {
    viewportRef.value.style.cursor = value
  }
}

watch(isPanning, (panning) => {
  setCursor(panning ? 'grabbing' : 'grab')
}, { immediate: true })

</script>

<template>
  <div
    ref="viewportRef"
    class="relative w-full h-dvh overflow-hidden select-none"
    :style="cssVars as any"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
    @wheel="onWheel"
  >
    <!-- Dotted background -->
    <div
      class="absolute inset-0"
      style="
        background-image: radial-gradient(var(--dot-color) 1px, transparent 1px);
        background-size: var(--grid-size) var(--grid-size);
        background-position: var(--grid-pos-x) var(--grid-pos-y);
      "
    />

    <!-- World content layer -->
    <div
      class="absolute inset-0"
      :style="{
        transform: transformStyle,
        transformOrigin: '0 0',
        willChange: 'transform',
      }"
    >
      <!-- Nodes will be rendered here -->
    </div>

    <!-- Selection rectangle -->
    <div v-if="selectionRect"
         class="absolute border border-primary-500/60 bg-primary-500/10 rounded-sm pointer-events-none"
         :style="{
           left: selectionRect.x + 'px',
           top: selectionRect.y + 'px',
           width: selectionRect.width + 'px',
           height: selectionRect.height + 'px',
         }"
    />
  </div>
</template>

<style scoped>
</style>


