import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root: resolve(projectRoot, 'web'),
    base: './',
    build: {
        outDir: resolve(projectRoot, 'dist'),
        emptyOutDir: true
    }
});
