import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// ESM doesn't define __dirname; compute it for path-based inputs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: 'src/',

    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                trips: resolve(__dirname, 'src/trips/index.html'),
                expenses: resolve(__dirname, 'src/expenses/index.html'),
                reports: resolve(__dirname, 'src/reports/index.html'),
                settings: resolve(__dirname, 'src/settings/index.html'),
            },
        },
    },
});
