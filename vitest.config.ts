import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		root: "./src",
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: ["./setup-vitest.ts"],
		},
	})
);
