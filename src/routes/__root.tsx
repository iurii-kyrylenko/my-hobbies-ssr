/// <reference types="vite/client" />
import { QueryClient } from "@tanstack/react-query";
import {
    HeadContent,
    Link,
    Outlet,
    Scripts,
    createRootRouteWithContext,
    useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useServerFn } from "@tanstack/react-start";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { ThemeProvider, useTheme } from "~/components/theme-provider";
import appCss from "~/styles/app.css?url";
import { getCurrentUserFn, logoutFn } from "~/utils/auth";
import { seo } from "~/utils/seo";
import { getThemeServerFn } from "~/utils/theme";

// The rootRoute acts as the "source of truth" for the context available to all child routes
// So we have to use createRootRouteWithContext instead of createRootRoute.
interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            ...seo({
                title:
                    "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
                description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
            }),
        ],
        links: [
            { rel: "stylesheet", href: appCss },
            {
                rel: "apple-touch-icon",
                sizes: "180x180",
                href: "/apple-touch-icon.png",
            },
            {
                rel: "icon",
                type: "image/png",
                sizes: "32x32",
                href: "/favicon-32x32.png",
            },
            {
                rel: "icon",
                type: "image/png",
                sizes: "16x16",
                href: "/favicon-16x16.png",
            },
            { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
            { rel: "icon", href: "/favicon.ico" },
        ],
        scripts: [
            {
                src: "/customScript.js",
                type: "text/javascript",
            },
        ],
    }),
    errorComponent: DefaultCatchBoundary,
    notFoundComponent: () => <NotFound />,
    component: RootComponent,
    beforeLoad: async () => {
        const user = await getCurrentUserFn();
        return { user };
    },
    loader: () => getThemeServerFn(),
});

function RootComponent() {
    const theme = Route.useLoaderData();

    return (
        <html className={theme} lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider theme={theme}>
                    <AppBar />
                    <Outlet />
                </ThemeProvider>
                <TanStackRouterDevtools position="bottom-right" />
                <Scripts />
            </body>
        </html>
    );
}

function AppBar() {
    return (
        <>
            <div className="p-2 flex gap-2 text-lg">
                <Link to="/" activeProps={{ className: "font-bold" }} activeOptions={{ exact: true }}>
                    Home
                </Link>
                {" | "}
                <Link to="/protected-1" activeProps={{ className: "font-bold" }}>
                    Protected-1
                </Link>
                {" | "}
                <Link to="/protected-2" activeProps={{ className: "font-bold" }}>
                    Protected-2
                </Link>
                {" | "}
                <Link to="/paging" activeProps={{ className: "font-bold" }}>
                    Paging
                </Link>
                <ChangeTheme />
                <AuthControl />
            </div>
            <hr />
        </>
    );
}

function ChangeTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="ms-auto cursor-pointer hover:underline"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme}
        </button>
    );
}

function AuthControl() {
    const router = useRouter();
    const navigate = Route.useNavigate();
    const logoutServerFn = useServerFn(logoutFn);
    const { user } = Route.useRouteContext();

    const handleLogout = async () => {
        await logoutServerFn();
        await router.invalidate();
        navigate({ to: "/" });
    };

    return (
        <div className="inline-block ms-auto pe-2">
            {!user ? (
                <Link to="/login" activeProps={{ className: "font-bold" }}>
                    Login
                </Link>
            ) : (
                <>
                    <span className="cursor-pointer" title={JSON.stringify(user, null, 2)}>
                        {user.name}
                    </span>
                    {" → "}
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer hover:underline"
                    >
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}
