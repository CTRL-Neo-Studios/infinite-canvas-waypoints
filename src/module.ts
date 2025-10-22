import {defineNuxtModule, addPlugin, createResolver} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@type32/jsoncanvas-editor-nuxt',
		configKey: 'jsonCanvasEditor',
	},
	// Default configuration options of the Nuxt module
	defaults: {},
	setup(_options, _nuxt) {
		const resolver = createResolver(import.meta.url)

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		addPlugin(resolver.resolve('./runtime/plugin'))
		_nuxt.options.css.unshift(resolver.resolve('./runtime/styles/main.css'))
	},
})
