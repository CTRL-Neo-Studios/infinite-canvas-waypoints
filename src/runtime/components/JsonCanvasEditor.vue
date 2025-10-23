<template>
  <div
    :style="{
      '--scale': scale.toString(),
      '--pan-x': `${panOffsetX}px`,
      '--pan-y': `${panOffsetY}px`,
      cursor: isPanning ? 'grabbing' : undefined,
    }"
    :class="['jsonc-wrapper', isSpacePressed ? 'will-pan' : '']"
  >
    <div class="jsonc-container">
      <div class="jsonc-canvas-container">
        <svg ref="edgesSvgRef" class="jsonc-edges">
          <defs>
            <marker id="jsonc-arrowhead" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" />
            </marker>
          </defs>
          <g ref="edgesGroupRef"></g>
        </svg>

        <div ref="nodesContainerRef" class="jsonc-nodes">
          <template v-for="node in model.nodes" :key="node.id">
            <CanvasNode
              :id="node.id"
              :node="node"
              :active="activeNodeId === node.id"
              @dragStart="onNodeDragStart(node, $event)"
              @dragBy="onNodeDragBy(node, $event)"
              @dragEnd="onNodeDragEnd(node, $event)"
            />
          </template>
        </div>

        <div class="jsonc-controls">
          <UButton size="sm" icon="i-lucide-code" @click="isShowOutput = !isShowOutput">Output</UButton>
          <UButton size="sm" icon="i-lucide-zoom-out" @click="handleZoomOut" />
          <UButton size="sm" icon="i-lucide-zoom-in" @click="handleZoomIn" />
          <UButton size="sm" icon="i-lucide-rotate-ccw" @click="handleZoomReset" />
        </div>

        <UCard v-if="isShowOutput" class="jsonc-output">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">JSON Canvas</span>
              <UButton variant="ghost" icon="i-lucide-x" @click="isShowOutput = false" />
            </div>
          </template>
          <div class="jsonc-output-code">
            <pre><code class="language-json">{{ formattedJSON }}</code></pre>
          </div>
          <template #footer>
            <div class="flex justify-center gap-2">
              <UButton size="xs" icon="i-lucide-clipboard" @click="copyJSON">Copy</UButton>
              <UButton size="xs" icon="i-lucide-download" @click="downloadJSON">Download</UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useEventListener, useMouse } from '@vueuse/core'
import type { JSONCanvas } from '../types/jsoncanvas'
import { clamp } from '../types/jsoncanvas'
import { getAnchorPoint } from '../utils/canvas'
import CanvasNode from './JsonCanvasNode.vue'

const ZOOM_SPEED = 0.1
const MIN_SCALE = 0.35
const MAX_SCALE = 1.25

const props = defineProps<{
  modelValue: JSONCanvas
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: JSONCanvas): void
}>()

const model = reactive<JSONCanvas>({
  nodes: props.modelValue.nodes ?? [],
  edges: props.modelValue.edges ?? [],
  metadata: props.modelValue.metadata ?? { version: '1.0', frontmatter: {} },
})

watch(
  () => props.modelValue,
  (v) => {
    model.nodes = v.nodes ?? []
    model.edges = v.edges ?? []
    model.metadata = v.metadata ?? { version: '1.0', frontmatter: {} }
    nextTick(drawEdges)
  },
  { deep: true }
)

watch(
  () => model,
  () => emit('update:modelValue', JSON.parse(JSON.stringify(model)) as JSONCanvas),
  { deep: true }
)

const edgesSvgRef = ref<SVGSVGElement | null>(null)
const edgesGroupRef = ref<SVGGElement | null>(null)
const nodesContainerRef = ref<HTMLDivElement | null>(null)

const scale = ref(1)
const panOffsetX = ref(0)
const panOffsetY = ref(0)

const isShowOutput = ref(false)
const isSpacePressed = ref(false)
const isPanning = ref(false)
const activeNodeId = ref<string | null>(null)

const formattedJSON = computed(() => JSON.stringify(model, null, 2))

function adjustCanvasToViewport() {
  const container = nodesContainerRef.value
  if (!container) return
  const nodeEls = container.querySelectorAll<HTMLElement>('[data-jsonc-node]')
  if (!nodeEls.length) return

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  nodeEls.forEach((el) => {
    const x = parseInt(el.style.left || '0', 10)
    const y = parseInt(el.style.top || '0', 10)
    const width = el.offsetWidth
    const height = el.offsetHeight
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x + width)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y + height)
  })

  const boundingBoxWidth = maxX - minX
  const boundingBoxHeight = maxY - minY
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const scaleX = viewportWidth / (boundingBoxWidth + 80)
  const scaleY = viewportHeight / (boundingBoxHeight + 80)
  scale.value = Math.min(scaleX, scaleY, 1)
  panOffsetX.value = (viewportWidth - boundingBoxWidth * scale.value) / 2 - minX * scale.value
  panOffsetY.value = (viewportHeight - boundingBoxHeight * scale.value) / 2 - minY * scale.value
}

function drawEdges() {
  const g = edgesGroupRef.value
  if (!g) return
  g.innerHTML = ''

  model.edges?.forEach((edge) => {
    const fromNode = document.getElementById(edge.fromNode) as HTMLElement | null
    const toNode = document.getElementById(edge.toNode) as HTMLElement | null
    if (!fromNode || !toNode) return

    const fromPoint = getAnchorPoint(fromNode, edge.fromSide)
    const toPoint = getAnchorPoint(toNode, edge.toSide)

    const curveTightness = 0.75
    const c1x = fromPoint.x + (toPoint.x - fromPoint.x) * curveTightness
    const c2x = fromPoint.x + (toPoint.x - fromPoint.x) * (1 - curveTightness)
    const c1y = fromPoint.y
    const c2y = toPoint.y

    const d = `M ${fromPoint.x} ${fromPoint.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toPoint.x} ${toPoint.y}`
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    path.setAttribute('stroke', edge.color || 'currentColor')
    path.setAttribute('fill', 'none')
    if (edge.toEnd === 'arrow' || !edge.toEnd) {
      path.setAttribute('marker-end', 'url(#jsonc-arrowhead)')
    }
    g.appendChild(path)
  })
}

function handleZoomIn() {
  scale.value = clamp(scale.value + ZOOM_SPEED, MIN_SCALE, MAX_SCALE)
}
function handleZoomOut() {
  scale.value = clamp(scale.value - ZOOM_SPEED, MIN_SCALE, MAX_SCALE)
}
function handleZoomReset() {
  nextTick(adjustCanvasToViewport)
}

function onNodeDragStart(node: NonNullable<JSONCanvas['nodes']>[number]) {
  activeNodeId.value = node.id
}
function onNodeDragBy(node: NonNullable<JSONCanvas['nodes']>[number], delta: { dx: number; dy: number }) {
  node.x += Math.round(delta.dx / scale.value)
  node.y += Math.round(delta.dy / scale.value)
  nextTick(drawEdges)
}
function onNodeDragEnd() {
  activeNodeId.value = null
  nextTick(drawEdges)
}

function copyJSON() {
  navigator.clipboard?.writeText(formattedJSON.value).catch(() => {})
}
function downloadJSON() {
  const blob = new Blob([formattedJSON.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'canvas.json'
  a.click()
  URL.revokeObjectURL(url)
}

// Wheel zoom with ctrl/cmd
useEventListener(window, 'wheel', (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY > 0) handleZoomOut()
    else handleZoomIn()
  }
}, { passive: false })

// Space to pan
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    e.preventDefault()
    isSpacePressed.value = true
  }
})
useEventListener(window, 'keyup', (e: KeyboardEvent) => {
  if (e.code === 'Space') isSpacePressed.value = false
})

// Panning with space + drag
const { x: mouseX, y: mouseY } = useMouse()
let panStartX = 0
let panStartY = 0
useEventListener(window, 'mousedown', () => {
  if (isSpacePressed.value) {
    isPanning.value = true
    panStartX = mouseX.value - panOffsetX.value
    panStartY = mouseY.value - panOffsetY.value
  }
})
useEventListener(window, 'mousemove', () => {
  if (isPanning.value) {
    panOffsetX.value = mouseX.value - panStartX
    panOffsetY.value = mouseY.value - panStartY
  }
})
useEventListener(window, 'mouseup', () => {
  if (isPanning.value) isPanning.value = false
})

onMounted(() => {
  nextTick(() => {
    adjustCanvasToViewport()
    drawEdges()
  })
})
onUnmounted(() => {
  // no-op
})
</script>

<style scoped>
.jsonc-wrapper {
  color-scheme: light dark;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background-color: var(--ui-bg, transparent);
  margin: 0;
  padding: 0;
  font-size: 1rem;
}

.jsonc-container {
  height: 100%;
  width: 100%;
}

.jsonc-canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(0,0,0,0.02);
  background-image: radial-gradient(
    rgb(var(--ui-contrast-200)) calc(var(--scale) * 0.5px + 0.5px),
    transparent 0
  );
  background-size: calc(var(--scale) * 20px) calc(var(--scale) * 20px);
  overflow: hidden;
  background-position: calc(var(--pan-x) - 19px) calc(var(--pan-y) - 19px);
}

.jsonc-edges,
.jsonc-nodes {
  opacity: 1;
  transform: translate(var(--pan-x), var(--pan-y)) scale(var(--scale));
  transform-origin: left top;
}

.jsonc-edges {
  z-index: 10;
  pointer-events: none;
  user-select: none;
  overflow: visible;
  position: absolute;
  inset: 0;
}
.jsonc-edges path {
  stroke: rgb(var(--ui-primary-500));
  stroke-width: 2;
  fill: none;
}
#jsonc-arrowhead { fill: rgb(var(--ui-primary-500)); }

.jsonc-nodes { position: absolute; inset: 0; }

.jsonc-output {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 26rem;
  max-width: 40vw;
  z-index: 20;
}
.jsonc-output-code { max-height: 60vh; overflow: auto; }

.jsonc-controls {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 30;
  display: flex;
  gap: .5rem;
}

.will-pan { cursor: grab; }
</style>

