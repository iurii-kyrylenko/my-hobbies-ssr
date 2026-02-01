/// <reference types="vite/client" />
import {
    HeadContent,
    Link,
    Scripts,
    createRootRoute,
    useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { User, getCurrentUserFn, logoutFn } from "~/utils/auth";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
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
    shellComponent: RootDocument,
    beforeLoad: async () => {
        const user = await getCurrentUserFn();
        return { user };
    },
});

function RootDocument({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const navigate = Route.useNavigate();
    const logoutServerFn = useServerFn(logoutFn);
    const ctxt = Route.useRouteContext();

    const handleLogout = async () => {
        await logoutServerFn();
        await router.invalidate();
        navigate({ to: "/" });
    };

    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
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
                    <AuthControl user={ctxt.user} onLogout={handleLogout} />
                </div>
                <hr />
                {children}
                <TanStackRouterDevtools position="bottom-right" />
                <Scripts />
            </body>
        </html>
    );
}

function AuthControl({ user, onLogout }: { user: User | null, onLogout: () => Promise<void> }) {
    return (
        <div className="inline-block ms-auto pe-2">
            {!user ? (
                <Link to="/login" activeProps={{ className: "font-bold" }}>
                    Login
                </Link>
            ) : (
                <>
                    <span>{user.email}</span>
                    {" → "}
                    <button
                        onClick={onLogout}
                        className="cursor-pointer hover:underline"
                    >
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}
