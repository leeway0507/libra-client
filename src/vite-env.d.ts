/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_API: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
