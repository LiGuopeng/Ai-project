import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.tsx', 'src/style.css'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    external: ['react', 'react-dom'],
    loader: {
        '.css': 'copy',
    },
})
