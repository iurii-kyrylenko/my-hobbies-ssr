import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';
import React, { FormEvent } from 'react';
import { Severity, useNotification } from '~/components/notifications';
import { updateUser } from '~/server/users';

export const Route = createFileRoute('/_auth/profile')({
    loader: () => ({ pageName: "Profile" }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();

    const [shareBooks, setShareBooks] = React.useState(user.shareBooks);
    const [shareMovies, setShareMovies] = React.useState(user.shareMovies);
    const [password, setPassword] = React.useState("");
    const [confirmation, setConfirmation] = React.useState("");

    const mutationFn = useServerFn(updateUser);
    const notify = useNotification();

    const mutation = useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["people"] });
            notify({ message: "Yout profile was updated", severity: Severity.MSG });
        },
    });

    const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const message =
            password && password.length < 8 ? "Password too short!" :
                password !== confirmation ? "Password and confirmation differ!" :
                    null;

        if (message) {
            notify({ message, severity: Severity.ERR });
            return;
        }

        mutation.mutate({
            data: {
                userId: user._id,
                shareBooks,
                shareMovies,
                ...(password ? { password } : {}),
            }
        });
    };

    return (
        <div className="p-2 grid gap-2 place-items-center">
            <form autoComplete="off" className="mt-4 max-w-lg" onSubmit={handleUpdate}>
                <fieldset className="w-full grid gap-6">
                    <div className="grid gap-2 items-center justify-items-start min-w-[300px]">
                        <label htmlFor="books" className="text-sm font-medium">
                            Share books
                        </label>
                        <input
                            id="books"
                            name="books"
                            type="checkbox"
                            checked={shareBooks}
                            onChange={(e) => setShareBooks(e.target.checked)}
                        />
                    </div>
                    <div className="grid gap-2 items-center justify-items-start min-w-[300px]">
                        <label htmlFor="movies" className="text-sm font-medium">
                            Share movies
                        </label>
                        <input
                            id="movies"
                            name="movies"
                            type="checkbox"
                            checked={shareMovies}
                            onChange={(e) => setShareMovies(e.target.checked)}
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="password" className="text-sm font-medium">
                            New password
                        </label>
                        <input
                            id="password"
                            name="password"
                            placeholder="Enter new password"
                            type="password"
                            className="border rounded-md p-2 w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="confirmation" className="text-sm font-medium">
                            Confirmation
                        </label>
                        <input
                            id="confirmation"
                            name="confirmation"
                            placeholder="Enter confirmation"
                            type="password"
                            className="border rounded-md p-2 w-full"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
                    >
                        Update
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
