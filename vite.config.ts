import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import rsc from "@vitejs/plugin-rsc";

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        port: 3000,
    },
    plugins: [
        tailwindcss(),
        tanstackStart({
            srcDirectory: "src",
            rsc: {
                enabled: true,
            },
        }),
        rsc(),
        viteReact(),
        nitro(),
    ],
    optimizeDeps: {
        // Exclude this server-side dependency to avoid bundling errors
        exclude: ['mongodb-client-encryption'],
    },
    ssr: {
        // Ensure this module is externalized during server-side rendering
        external: ['mongodb-client-encryption'],
    },
});
