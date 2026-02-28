import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { MoviesPage, getPageMovies, pageSize } from "~/server/movies";

export const moviesQueryOptions = (userId: string, filter?: string) =>
    infiniteQueryOptions({
        queryKey: ["movies", userId, filter],
        queryFn: async ({ pageParam = 1 }): Promise<MoviesPage> => getPageMovies({
            data: {
                userId,
                filter,
                page: pageParam,
            },
        }),
        getNextPageParam: (lastPage) =>
            lastPage.movies.length === pageSize ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/$userId/movies")({
    loaderDeps: ({ search }) => ({
        filter: search.filter,
    }),
    loader: async ({ context: { queryClient, user }, params: { userId }, deps: { filter } }) => {
        // Prefetch the first page on the server
        await queryClient.prefetchInfiniteQuery(moviesQueryOptions(userId, filter));
        return ({ pageName: user?._id === userId ? "My Movies" : "User's Movies" });
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { userId } = Route.useParams();
    const { filter } = Route.useSearch();
    const { user } = Route.useRouteContext();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(moviesQueryOptions(userId, filter));

    return (
        <div>
            {user?._id === userId
                ? <Link
                    className="fixed up-6 right-6 size-12 text-2xl rounded-full bg-blue-400/80 text-white shadow-lg flex items-center justify-center transition-colors"
                    to="/movies/new">+</Link>
                : null}

            {data?.pages.map((page) => (
                <React.Fragment key={page.page}>
                    {page.movies.map((movie) => (
                        <React.Fragment key={movie._id}>
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(movie, null, 2)}
                            </pre>
                            {user?._id === movie.userId &&
                                <div className="ml-12">
                                    <Link className="hover:underline" to="/movies/$movieId" params={{ movieId: movie._id }}>
                                        Update
                                    </Link>
                                    {" | "}
                                    <button className="cursor-pointer hover:underline">
                                        Delete
                                    </button>
                                </div>}
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}

            <button
                className="mb-16 p-2 border rounded-md"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? "Loading..."
                    : hasNextPage
                        ? <span className="cursor-pointer hover:underline">Load More</span>
                        : "Nothing more to load"
                }
            </button>
        </div>
    );
}
