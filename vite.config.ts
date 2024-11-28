import { defineConfig } from "vite";
import path from "path"
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
const isTest = process.env.NODE_ENV === 'test'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), !isTest && TanStackRouterVite(), tsconfigPaths(), wasm(), topLevelAwait({
    // The export name of top-level await promise for each chunk module
    promiseExportName: "__tla",
    // The function to generate import names of top-level await promise in each chunk module
    promiseImportName: i => `__tla_${i}`
  })],
  base: process.env.NODE_ENV === "pages" ? "/tauri-migraine-log/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // support `describe`, `test` etc. globally, 
    // so you don't need to import them every time
    // globals: true, 
    // add jest global variables
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    // run tests in jsdom environment
    environment: "jsdom",
    // global test setup
    setupFiles: "./tests/setup.js",
    include: ["tests/**/*.test.tsx"]
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    worker: {
      format: "es",
      plugins: () => [wasm()],
    },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows'
        ? 'chrome105'
        : 'safari13',
    // don't minify for debug builds
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
  
}));
