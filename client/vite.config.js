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
            '/api': 'http://localhost:5000/', // the address that u serve in the backend
            '/upload': 'http://localhost:5000/', // прокси для загрузки файлов
            '/uploads': 'http://localhost:5000/', // прокси для получения загруженных файлов
        },
    },
});
