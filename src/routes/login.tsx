import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, useState } from "react";
import z from "zod";
import { Severity, useNotification } from "~/components/notifications";
import { getCurrentUserFn, loginFn } from "~/server/users";

const fallback = "/" as const;

export const Route = createFileRoute("/login")({
    validateSearch: z.object({
        redirect: z.string().optional().catch(""),
    }),
    beforeLoad: async ({ search }) => {
        if (await getCurrentUserFn()) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    loader: () => ({ pageName: "Login" }),
    component: RouteComponent,
});

function RouteComponent() {
    const search = Route.useSearch();
    const mutationFn = useServerFn(loginFn);
    const notify = useNotification();

    const mutation = useMutation({
        mutationFn,
        onSuccess: () => {
            notify({ message: "You were logged in", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);

        const name = data.get("name")?.toString() ?? "";
        const password = data.get("password")?.toString() ?? "";
        const redirectTo = search.redirect ?? fallback;

        mutation.mutate({ data: { name, password, redirectTo } });
    };

    return (
        <div className="p-2 grid gap-2 place-items-center">
            <h3 className="text-xl">Login page</h3>
            {search.redirect ? (
                <p className="text-red-500">You need to login to access this page.</p>
            ) : (
                <p>Login to see the protected content.</p>
            )}
            <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
                <fieldset className="w-full grid gap-6">
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="name" className="text-sm font-medium">
                            User name
                        </label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            type="text"
                            autoComplete="username"
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
                            autoComplete="current-password"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
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
