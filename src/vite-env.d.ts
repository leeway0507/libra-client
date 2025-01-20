/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module "*.css" {
	const classes: { [key: string]: string };
	export default classes;
}

interface ImportMetaEnv {
	readonly VITE_BACKEND_API: string;
	readonly VITE_MAX_LIBRARY_COUNT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
