import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"
export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        tailwindcss(),
        tsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        tanstackStart({
            srcDirectory: "src",
        }),
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
