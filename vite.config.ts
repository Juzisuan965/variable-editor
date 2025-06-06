import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: "./src/components/index.ts",
      name: "variable-editor",
      fileName: (format) => `variable-editor.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@tiptap/core",
        "@tiptap/extension-mention",
        "@tiptap/starter-kit",
        "@tiptap/suggestion",
        "@tiptap/vue-3",
      ],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
