<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: JSON Canvas Editor for Nuxt
- Package name: @type32/infinite-canvas-waypoints
- Description: A component that allows you to input and edit a JSON Canvas.
-->

# JSON Canvas Editor for Nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A component that allows you to input and edit a JSON Canvas.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
bunx nuxi module add @type32/infinite-canvas-waypoints
```
or
```bash
bun add @type32/infinite-canvas-waypoints
```

That's it! You can now use JSON Canvas Editor in your Nuxt app ✨

### Usage

Add the module to your `nuxt.config.ts` and drop the `JsonCanvasEditor` anywhere:

```vue
<template>
  <div class="h-dvh">
    <JsonCanvasEditor v-model="canvas" />
  </div>
 </template>

<script setup lang="ts">
import type { JSONCanvas } from '@type32/infinite-canvas-waypoints'
const canvas = ref<JSONCanvas>({ nodes: [], edges: [], metadata: { version: '1.0', frontmatter: {} } })
</script>
```

The editor supports:

- Pan/zoom with mouse and trackpad
- Add Text/File/Link/Group nodes
- Drag to move, resize via handle (snap to grid)
- Draw edges with arrowheads; delete with keyboard
- Import/export JSON via your own controls (or via exposed methods)

Inspiration and reference implementations for rendering-only solutions:

- `vue-json-canvas` by wujieli0207 [`github.com/wujieli0207/vue-json-canvas`](https://github.com/wujieli0207/vue-json-canvas)
- `JSON-Canvas-Viewer` by Hesprs [`github.com/Hesprs/JSON-Canvas-Viewer`](https://github.com/Hesprs/JSON-Canvas-Viewer)


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  bun install
  
  # Generate type stubs
  bun run dev:prepare
  
  # Develop with the playground
  bun run dev
  
  # Build the playground
  bun run dev:build
  
  # Run Vitest
  bun run test
  bun run test:watch
  
  # Release new version
  bun run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
