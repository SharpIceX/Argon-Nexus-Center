declare module '*.svg' {
	import type { DefineComponent, SVGAttributes } from 'vue';
	const component: DefineComponent<SVGAttributes, object, unknown>;
	export default component;
}

declare module '*.svg?component' {
	import type { DefineComponent, SVGAttributes } from 'vue';
	const component: DefineComponent<SVGAttributes, object, unknown>;
	export default component;
}
