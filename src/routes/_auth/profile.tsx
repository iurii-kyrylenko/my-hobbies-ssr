import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';
import React, { FormEvent } from 'react';
import { updateUser } from '~/server/users';

export const Route = createFileRoute('/_auth/profile')({
    loader: () => ({ pageName: "Profile" }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();

    const [shareBooks, setShareBooks] = React.useState(user.shareBooks);
    const [shareMovies, setShareMovies] = React.useState(user.shareMovies);

    const mutationFn = useServerFn(updateUser);

    const mutation = useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["people"] });
        },
    });

    const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({ data: { userId: user._id, shareBooks, shareMovies } });
    };

    return (
        <div className="p-2 grid gap-2 place-items-center">
            <form className="mt-4 max-w-lg" onSubmit={handleUpdate}>
                <fieldset className="w-full grid gap-2">
                    <div className="grid gap-2 items-center min-w-[300px]">
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
                    <div className="grid gap-2 items-center min-w-[300px]">
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        Update
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
