import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import z from "zod";
import { getCurrentUserFn, loginFn } from "~/utils/auth";
import { sleep } from "~/utils/hepers";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = "/protected" as const;

export const Route = createFileRoute("/login")({
    validateSearch: z.object({
        redirect: z.string().optional().catch(""),
    }),
    beforeLoad: async ({ context, search }) => {
        if (await getCurrentUserFn()) {
            throw redirect({ to: search.redirect || fallback })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter();
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const loginServerFn = useServerFn(loginFn);

    const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        try {
            evt.preventDefault()
            const data = new FormData(evt.currentTarget)

            const fieldEmail = data.get("email");
            if (!fieldEmail) return;
            const email = fieldEmail.toString();

            const fieldPassword = data.get("password");
            if (!fieldPassword) return;
            const password = fieldPassword.toString();

            await loginServerFn({ data: { email, password } });
            await router.invalidate()

            // This is just a hack being used to wait for the auth state to update
            // in a real app, you'd want to use a more robust solution
            await sleep(1);

            await navigate({ to: search.redirect || fallback })
        } catch (error) {
            console.error('Error logging in: ', error)
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
                        <label htmlFor="email-input" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email-input"
                            name="email"
                            placeholder="Enter your email"
                            type="text"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="password-input" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password-input"
                            name="password"
                            placeholder="Enter your password"
                            type="text"
                            className="border rounded-md p-2 w-full"
                            required
                        />
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
