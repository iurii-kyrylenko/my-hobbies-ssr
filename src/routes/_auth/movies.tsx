import { infiniteQueryOptions, useInfiniteQuery, } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_auth/movies")({
    loaderDeps: ({ search }) => ({
        filter: search.filter,
    }),
    loader: async ({ context: { queryClient, user }, deps: { filter } }) => {
        // Prefetch the first page on the server
        await queryClient.prefetchInfiniteQuery(moviesQueryOptions(user?._id, filter));
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();
    const { filter } = Route.useSearch();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(moviesQueryOptions(user?._id, filter));

    return (
        <div>
            {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.movies.map((movie) => (
                        <pre key={movie._id}>
                            {JSON.stringify(movie, null, 2)}
                        </pre>
                    ))}
                </React.Fragment>
            ))}

            <button
                className="my-2 p-2 border rounded-md"
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
