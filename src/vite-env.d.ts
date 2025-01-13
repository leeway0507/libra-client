/// <reference types="vite-plugin-pages/client-react" />

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
