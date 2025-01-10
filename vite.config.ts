import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import Pages from "vite-plugin-pages";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	plugins: [
		react({ jsxImportSource: "@emotion/react" }),
		Pages({ dirs: "src/pages", routeStyle: "next" }),
		tsconfigPaths(),
		visualizer({
			open: true, // 빌드 후 브라우저에서 시각화 결과 열기
			filename: "stats.html", // 결과 저장 파일 이름
			gzipSize: true,
			brotliSize: true,
		}) as PluginOption,
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"], // 공통 모듈 분리
					"chakra-ui": ["@chakra-ui/react"],
				},
			},
		},
	},
});
