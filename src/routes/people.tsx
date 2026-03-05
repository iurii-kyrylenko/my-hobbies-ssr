import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpenIcon, FilmIcon } from "@heroicons/react/24/outline";
import { getPeopleFn } from "~/server/users";

export const peopleQueryOptions = () =>
    queryOptions({
        queryKey: ["people"],
        queryFn: async () => getPeopleFn(),
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/people")({
    loader: ({ context: { queryClient } }) =>
        ({ data: queryClient.ensureQueryData(peopleQueryOptions()), pageName: "People" }),
    component: RouteComponent,
})

function RouteComponent() {
    // Even though the data is loaded in the loader, we must call useQuery
    // inside the component. TanStack Query rehydrates the cache on the client and
    // useQuery hooks into that cached entry. When we call
    // queryClient.invalidateQueries({ queryKey: [...] }), the useQuery hook
    // detects the change and triggers a background refetch.
    const { data } = useQuery(peopleQueryOptions());

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 gap-4 items-start">
            {data?.map((user) => (
                <div
                    className="p-3 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50 flex flex-col gap-4"
                    key={user._id}
                >
                    <span className="text-xl">{user.name}</span>
                    <div className="ms-2 flex gap-4">
                        {!!user.books && <Link className="flex gap-2 hover:underline" to="/$userId/books" params={{ userId: user._id }}>
                            <BookOpenIcon className="size-6 text-blue-400" />
                            <div className="opacity-80">BOOKS: {user.books}</div>
                        </Link>}
                        {!!user.movies && <Link className="flex gap-2 hover:underline" to="/$userId/movies" params={{ userId: user._id }}>
                            <FilmIcon className="size-6 text-blue-400" />
                            <div className="opacity-80">MOVIES: {user.movies}</div>
                        </Link>}
                    </div>
                </div>)
            )}
        </div>
    );
}
