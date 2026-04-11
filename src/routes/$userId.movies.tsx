import { infiniteQueryOptions, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { MoviesPage, deleteMovie, getPageMovies, pageSize } from "~/server/movies";
import { useInView } from "react-intersection-observer";
import { MovieCard } from "~/components/MovieCard";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import { Severity, useNotification } from "~/components/notifications";

interface MovieToDelete {
    _id: string;
    title: string;
}

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
        return ({ pageName: user?._id === userId ? "My Movies" : "User's Movies", isFilter: true });
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

    const notify = useNotification();

    const deleteMovieMutation = useMutation({
        mutationFn: deleteMovie,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["movies", user?._id] });
            notify({ message: "A movie was deleted", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const [movieToDelete, setMovieToDelete] = React.useState<MovieToDelete | null>(null);

    const handleDelete = () => {
        movieToDelete && deleteMovieMutation.mutate({ data: { movieId: movieToDelete._id } });
        setMovieToDelete(null);
    };

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            {user?._id === userId
                ? <Link
                    className="fixed z-10 up-6 right-6 size-12 text-2xl rounded-full bg-blue-400/80 text-white shadow-lg flex items-center justify-center transition-colors"
                    to="/movies/new">+</Link>
                : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 gap-4 items-start">
                {data?.pages.map((page) => (
                    <React.Fragment key={page.page}>
                        {page.movies.map((movie) =>
                            <MovieCard
                                key={movie._id}
                                movie={movie}
                                userId={user?._id}
                                onDeleteMovie={() => setMovieToDelete(movie)}
                            />
                        )}
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

            <ConfirmationDialog
                isOpen={!!movieToDelete}
                onClose={() => setMovieToDelete(null)}
                onConfirm={handleDelete}
                message={`Do you want to delete movie "${movieToDelete?.title}"?`}
            />
        </>
    );
}
