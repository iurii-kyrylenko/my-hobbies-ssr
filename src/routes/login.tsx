import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import z from "zod";
import { getCurrentUserFn, loginFn } from "~/utils/auth";

const fallback = "/protected-1" as const;

export const Route = createFileRoute("/login")({
    validateSearch: z.object({
        redirect: z.string().optional().catch(""),
    }),
    beforeLoad: async ({ context, search }) => {
        if (await getCurrentUserFn()) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const search = Route.useSearch();
    const actionUrl = `${loginFn.url}?redirect=${encodeURIComponent(search?.redirect || fallback)}`;

    return (
        <div className="p-2 grid gap-2 place-items-center">
            <h3 className="text-xl">Login page</h3>
            {search.redirect ? (
                <p className="text-red-500">You need to login to access this page.</p>
            ) : (
                <p>Login to see all the cool content in here.</p>
            )}
            <form className="mt-4 max-w-lg" action={actionUrl} method="post">
                <fieldset className="w-full grid gap-2">
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    {/* Alternative option. To not modify the URL, we can pass the redirect path
                    as a hidden input within the form itself: */}
                    {/* <input type="hidden" name="redirect" value={search?.redirect || fallback} /> */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
                    >
                        Login
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
