import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import eslint from "vite-plugin-eslint";
import glsl from 'vite-plugin-glsl';
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    }),
    glsl({
      include: [
        // Glob pattern, or array of glob patterns to import
        '**/*.glsl',
        '**/*.wgsl',
        '**/*.vert',
        '**/*.frag',
        '**/*.vs',
        '**/*.fs',
      ],
      exclude: undefined, // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: 'glsl', // Shader suffix when no extension is specified
      compress: false, // Compress output shader code
      root: '/',
    }),
    cesium()
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
});
