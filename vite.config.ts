import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react-swc'
import Pages from 'vite-plugin-pages'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ jsxImportSource: "@emotion/react" }),
    Pages(
      { dirs: 'src/pages', routeStyle: "next" }
    )],
})
