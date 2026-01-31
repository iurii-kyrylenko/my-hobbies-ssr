import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, useState } from "react";
import z from "zod";
import { getCurrentUserFn, loginFn } from "~/utils/auth";

const fallback = "/protected-1" as const;

export const Route = createFileRoute("/login")({
    validateSearch: z.object({
        redirect: z.string().optional().catch(""),
    }),
    beforeLoad: async ({ search }) => {
        if (await getCurrentUserFn()) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const search = Route.useSearch();
    const loginServerFn = useServerFn(loginFn);
    const [error, setError] = useState("");

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const data = new FormData(e.currentTarget);

            const email = data.get("email")?.toString() ?? "";
            const password = data.get("password")?.toString() ?? "";
            const redirectTo = search.redirect ?? fallback;

            const result = await loginServerFn({ data: { email, password, redirectTo } });

            if (result) {
                setError(result.error);
            }
        } catch (error) {
            console.error('Error logging in: ', error);
        }
    };

    return (
        <div className="p-2 grid gap-2 place-items-center">
            <h3 className="text-xl">Login page</h3>
            {search.redirect ? (
                <p className="text-red-500">You need to login to access this page.</p>
            ) : (
                <p>Login to see all the cool content in here.</p>
            )}
            <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
                <fieldset className="w-full grid gap-2">
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            type="text"
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
                            type="text"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="text-red-500">
                        {error}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        Login
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
