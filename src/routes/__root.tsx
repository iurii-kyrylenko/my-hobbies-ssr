/// <reference types="vite/client" />
import { QueryClient, useQuery } from "@tanstack/react-query";
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRouteWithContext,
    retainSearchParams,
    useLocation,
    useMatches,
    useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";
import z from "zod";
import { FunnelIcon, UserIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { ThemeProvider, useTheme } from "~/components/theme-provider";
import appCss from "~/styles/app.css?url";
import { getCurrentUserFn, logoutFn } from "~/server/users";
import { seo } from "~/utils/seo";
import { getThemeServerFn } from "~/server/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MyDrawer } from "~/components/Drawer";

// The rootRoute acts as the "source of truth" for the context available to all child routes
// So we have to use createRootRouteWithContext instead of createRootRoute.
interface MyRouterContext {
    queryClient: QueryClient;
}

const searchSchema = z.object({
    filter: z.string().optional().catch(undefined),
});

type Search = z.infer<typeof searchSchema>;

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
    loader: async () => ({ theme: await getThemeServerFn(), pageName: null }),
    validateSearch: searchSchema,
    search: {
        // Retain the filter search param while navigating to any route.
        // The filter search param is set in the Filter component or
        // directly in the browser address bar, but used only in several
        // dedicated routes.
        middlewares: [retainSearchParams(["filter"])],
    },
});

function RootComponent() {
    const { theme } = Route.useLoaderData();

    return (
        <html className={theme} lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider theme={theme}>
                    <AppBar />
                    <Outlet />
                    <Footer />
                </ThemeProvider>
                <TanStackRouterDevtools position="bottom-right" />
                <ReactQueryDevtools buttonPosition="bottom-left" />
                <Scripts />
            </body>
        </html>
    );
}

function AppBar() {
    const { user } = Route.useRouteContext();

    return (
        <div className="sticky mb-2 top-0 z-10 bg-white dark:bg-black shadow-md dark:shadow-gray-500/50">
            <div className="py-2 px-3 h-16 flex justify-between items-center items-baseline text-lg">
                <div className="flex gap-3">
                    <MyDrawer />
                    <PageName />
                </div>
                <div className="flex-1 mx-4 md:mx-40 lg:mx-60">
                    <Filter />
                </div>
                <div className="flex gap-3">
                    <AuthUser />
                    <ThemeChanger />
                </div>
            </div>
        </div >
    );
}

function PageName() {
    const matches = useMatches();
    const pageName = matches[matches.length - 1].loaderData?.pageName;
    return <>{pageName}</>
}

function Footer() {
    const { data } = useQuery<string>({
        queryKey: ["message"],
        queryFn: () => "",
    });

    const { queryClient } = Route.useRouteContext();

    return (
        <>
            {data && <div className="fixed bottom-6 left-20 h-12 px-4 flex items-center text-white bg-red-800">
                <span
                    className="mr-2 hover:bg-red-600 cursor-pointer"
                    onClick={() => queryClient.setQueryData(["message"], () => "")}
                >
                    &nbsp;&#x2715;&nbsp;
                </span>
                {data}
            </div>}
        </>
    );
}

function Filter() {
    const navigate = useNavigate({ from: Route.fullPath });
    const { filter } = Route.useSearch();
    const [isForm, setIsForm] = React.useState(false);
    const [filterDraft, setFilterDraft] = React.useState(filter ?? "");
    const { pathname } = useLocation();

    return (
        <>
            {isForm
                ?
                <form onSubmit={(e) => {
                    e.preventDefault();
                    navigate({
                        to: pathname,
                        search: (old) => ({ ...old, filter: filterDraft || undefined }),
                        replace: true,
                    });
                    setIsForm(false);
                }}>
                    <input
                        className="border h-12 w-full min-w-20 rounded-md p-2"
                        autoFocus
                        type="search"
                        placeholder="Filter"
                        value={filterDraft}
                        onChange={(e) => setFilterDraft(e.target.value)}
                    >
                    </input>
                </form>
                : (
                    <button
                        className="cursor-pointer"
                        onClick={() => setIsForm(true)}
                    >
                        <FunnelIcon className="inline block size-6 text-blue-400" />
                        &nbsp;
                        {filter}
                    </button>
                )}
        </>
    );
}

function AuthUser() {
    const { user } = Route.useRouteContext();

    return (
        <button>
            <UserIcon className="inline block size-6 text-blue-400" />
            &nbsp;
            {user?.name}
        </button>
    );
}

function ThemeChanger() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="cursor-pointer"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === "light"
                ? <SunIcon className="size-6 text-blue-400" />
                : <MoonIcon className="size-6 text-blue-400" />
            }
        </button>
    );
}
