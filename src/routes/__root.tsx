/// <reference types="vite/client" />
import { QueryClient } from "@tanstack/react-query";
import {
    HeadContent,
    Link,
    Outlet,
    Scripts,
    createRootRouteWithContext,
    useLocation,
    useNavigate,
    useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useServerFn } from "@tanstack/react-start";
import React from "react";
import z, { optional } from "zod";
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

const searchSchema = z.object({
    filter: z.string().optional().catch(""),
});

type ProductSearch = z.infer<typeof searchSchema>;

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
    validateSearch: searchSchema,
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
    const { filter } = Route.useSearch();

    return (
        <>
            <div className="p-2 flex gap-2 text-lg items-baseline">
                <Link to="/" activeProps={{ className: "font-bold" }} activeOptions={{ exact: true }}>
                    Home
                </Link>
                {" | "}
                <Link to="/protected" activeProps={{ className: "font-bold" }}>
                    Protected
                </Link>
                {" | "}
                <Link to="/paging" search={{ filter: filter }} activeProps={{ className: "font-bold" }}>
                    Paging
                </Link>
                {" | "}
                <Link to="/books" activeProps={{ className: "font-bold" }}>
                    Books
                </Link>
                {" | "}
                <Link to="/books_ssr" activeProps={{ className: "font-bold" }}>
                    Books-SSR
                </Link>
                <div className="inline-block ms-auto">
                    <Filter />
                </div>
                <div className="inline-block ms-auto pe-2">
                    <AuthControl />
                    {" | "}
                    <ChangeTheme />
                </div>
            </div>
            <hr />
        </>
    );
}

function Filter() {
    const navigate = useNavigate({ from: Route.fullPath });
    const { filter } = Route.useSearch();
    const { pathname } = useLocation();
    const [filterDraft, setFilterDraft] = React.useState(filter ?? "");

    React.useEffect(() => {
        if (["/paging"].includes(pathname)) {
            navigate({
                to: pathname,
                search: { filter: filterDraft },
                replace: true,
            })
        }
    }, [filterDraft, pathname])

    return (
        <input
            className="border rounded-md p-2"
            type="search"
            placeholder="Filter"
            value={filterDraft}
            onChange={(e) => setFilterDraft(e.target.value)}
        >
        </input>
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
        <>
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
        </>
    );
}

function ChangeTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="cursor-pointer hover:underline"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme}
        </button>
    );
}
