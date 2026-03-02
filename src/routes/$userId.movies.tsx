import { infiniteQueryOptions, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { MoviesPage, getPageMovies, pageSize } from "~/server/movies";
import { useInView } from "react-intersection-observer";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MovieInfo } from "~/components/MovieInfo";

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
    const { ref, inView } = useInView();

    const { userId } = Route.useParams();
    const { filter } = Route.useSearch();
    const { user, queryClient } = Route.useRouteContext();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(moviesQueryOptions(userId, filter));

    // const deleteMovieMutation = useMutation({
    //     mutationFn: deleteMovie,
    //     onSuccess: () => {
    //         queryClient.removeQueries({ queryKey: ["movies", user?._id] });
    //     },
    // });

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            {user?._id === userId
                ? <Link
                    className="fixed up-6 right-6 size-12 text-2xl rounded-full bg-blue-400/80 text-white shadow-lg flex items-center justify-center transition-colors"
                    to="/movies/new">+</Link>
                : null}

            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-4 gap-4 items-start">

                {data?.pages.map((page) => (
                    <React.Fragment key={page.page}>
                        {page.movies.map((movie) => (
                            <div
                                className="border-2 p-2"
                                key={movie._id}
                            >
                                <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(movie, null, 2)}
                                </pre>

                                <Disclosure as="div" className="pt-2">
                                    <DisclosureButton className="group flex w-full items-center justify-between hover:cursor-pointer">
                                        <span>
                                            Details
                                        </span>
                                        <ChevronDownIcon className="size-5 group-data-open:rotate-180" />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                                        <MovieInfo {...movie} />
                                    </DisclosurePanel>
                                </Disclosure>

                                {user?._id === movie.userId &&
                                    <div>
                                        <Link className="hover:underline" to="/movies/$movieId" params={{ movieId: movie._id }}>
                                            Update
                                        </Link>
                                        {" | "}
                                        <button
                                            className="cursor-pointer hover:underline"
                                        // onClick={() => deleteMovieMutation.mutate({ data: { movieId: movie._id } })}
                                        >
                                            Delete
                                        </button>
                                    </div>}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <button
                ref={ref}
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
        </>
    );
}
