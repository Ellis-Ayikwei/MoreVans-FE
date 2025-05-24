import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 3000,
            host: true,
        },
        define: {
            'process.env': env,
        },
        build: {
            commonjsOptions: {
                include: [/node_modules/],
                transformMixedEsModules: true,
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        antd: ['antd'],
                        'react-vendor': ['react', 'react-dom'],
                    },
                },
            },
        },
        optimizeDeps: {
            include: ['antd'],
            esbuildOptions: {
                target: 'es2020',
            },
        },
    };
});
