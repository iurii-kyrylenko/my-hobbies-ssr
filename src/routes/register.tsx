import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Severity, useNotification } from "~/components/notifications";
import { getCurrentUserFn, registerFn } from "~/server/users";
;
export const Route = createFileRoute('/register')({
    beforeLoad: async () => {
        if (await getCurrentUserFn()) {
            throw redirect({ to: "/" });
        }
    },
    loader: () => ({ pageName: "Register" }), component: RouteComponent,
})

function RouteComponent() {
    const mutationFn = useServerFn(registerFn);
    const notify = useNotification();

    const mutation = useMutation({
        mutationFn,
        onSuccess: () => {
            notify({ message: "You were registered", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget);
        const name = data.get("name")?.toString() ?? "";
        const email = data.get("email")?.toString() ?? "";
        const password = data.get("password")?.toString() ?? "";
        const confirmation = data.get("confirmation")?.toString() ?? "";

        const message =
            name.length < 5 ? "Name too short!" :
            !/(.+)@(.+){2,}\.(.+){2,}/.test(email) ? "Invaid email format!" :
            password.length < 8 ? "Password too short!" :
            password !== confirmation ? "Password and confirmation differ!" :
            null;

        if (message) {
            notify({ message, severity: Severity.ERR });
            return;
        }

        mutation.mutate({ data: { name, email, password } });
    };

    return (
        <div className="p-2 grid gap-2 place-items-center">
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
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            type="email"
                            autoComplete="email"
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
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="confirmation" className="text-sm font-medium">
                            Confirmation
                        </label>
                        <input
                            id="confirmation"
                            name="confirmation"
                            placeholder="Confirm password"
                            type="password"
                            autoComplete="off"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
                    >
                        Register
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
