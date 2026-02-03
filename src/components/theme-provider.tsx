import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, use } from "react";
import { Theme, setThemeServerFn } from "~/utils/theme";

type ThemeContextType = { theme: Theme; setTheme: (val: Theme) => void };

// type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ theme, children }: { theme: Theme, children: React.ReactNode }) {
    const router = useRouter();

    async function setTheme(val: Theme) {
        await setThemeServerFn({ data: val });
        router.invalidate();
    }

    return (
        <ThemeContext value={{ theme, setTheme }}>
            {children}
        </ThemeContext>
    );
}

export function useTheme() {
    const val = use(ThemeContext);
    if (!val) throw new Error("useTheme called outside of ThemeProvider!");
    return val;
}
