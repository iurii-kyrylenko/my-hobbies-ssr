import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type Theme = "light" | "dark";
const STORAGE_KEY = "app-theme";

export const getThemeServerFn = createServerFn({ method: 'GET' }).handler(async () => {
    return (getCookie(STORAGE_KEY) || "light") as Theme;
});

export const setThemeServerFn = createServerFn({ method: 'POST' })
    .inputValidator((d: Theme) => d)
    .handler(async ({ data }) => {
        setCookie(STORAGE_KEY, data, { path: '/', maxAge: 31536000 });
    });
