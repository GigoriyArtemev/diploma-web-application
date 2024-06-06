import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        manifest: true,
        rollupOptions: {
            input: './src/main.jsx',
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
            '/upload': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
            '/auth': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },

            '/user': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
