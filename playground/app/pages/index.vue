<template>
  <div class="h-dvh w-full">
    <div class="h-14 border-b border-[--ui-border] flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <UButton size="sm" :disabled="!canUndo" @click="undo()">Undo</UButton>
        <UButton size="sm" :disabled="!canRedo" @click="redo()">Redo</UButton>
        <UDivider orientation="vertical" />
        <UButton size="sm" color="primary" @click="addSample">Add sample</UButton>
      </div>
      <div class="text-sm opacity-70">JSON Canvas Editor Playground</div>
    </div>
    <JsonCanvasEditor v-model="data" class="h-[calc(100dvh-56px)]" ref="editorRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { JSONCanvas } from '../../src/runtime/types/jsoncanvas'

const editorRef = ref<any>(null)
const data = ref<JSONCanvas>({ nodes: [], edges: [], metadata: { version: '1.0', frontmatter: {} } })

const canUndo = ref(false)
const canRedo = ref(false)

function undo() {
  if (editorRef.value) {
    editorRef.value.undo()
    updateHistoryState()
  }
}

function redo() {
  if (editorRef.value) {
    editorRef.value.redo()
    updateHistoryState()
  }
}

function updateHistoryState() {
  if (editorRef.value) {
    canUndo.value = editorRef.value.canUndo
    canRedo.value = editorRef.value.canRedo
  }
}

watch(data, updateHistoryState, { deep: true, immediate: true })

function addSample() {
  data.value = {
    nodes: [
      { id: 'g1', type: 'group', x: -300, y: -460, width: 610, height: 200, label: 'JSON Canvas' } as any,
      { id: 'f1', type: 'file', x: -280, y: -200, width: 570, height: 560, color: '6', file: 'readme.md' } as any,
      { id: 'f2', type: 'file', x: -280, y: -440, width: 217, height: 80, file: '_site/logo.svg' } as any,
      { id: 't1', type: 'text', x: 40, y: -440, width: 250, height: 160, text: 'Learn more:\n\n- [Apps](/docs/apps.md)\n- [Spec](spec/1.0.md)\n- [Github](https://github.com/obsidianmd/jsoncanvas)' } as any,
      { id: 'f3', type: 'file', x: 360, y: -400, width: 400, height: 400, file: 'spec/1.0.md' } as any,
    ],
    edges: [
      { id: 'e1', fromNode: 'f2', toNode: 't1', fromSide: 'right', toSide: 'left' },
    ],
    metadata: { version: '1.0', frontmatter: {} },
  }
}
</script>
