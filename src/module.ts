import {defineNuxtModule, addPlugin, createResolver} from '@nuxt/kit'
import {addComponentsDir, addImportsDir} from '@nuxt/kit'

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

		// addPlugin(resolver.resolve('./runtime/plugin'))
		_nuxt.options.css.push(resolver.resolve('./runtime/styles/main.css'))

		_nuxt.options.alias["@type32/jsoncanvas-editor-nuxt"] = resolver.resolve("./runtime/editor/types/jsoncanvas.ts");

		// Auto-import components and composables
		addComponentsDir({
			path: resolver.resolve('./runtime/components'),
			pathPrefix: false,
		})
		addImportsDir(resolver.resolve('./runtime/composables'))
	},
})
