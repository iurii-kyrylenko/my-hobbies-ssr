import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPageMovies, deleteMovie, MovieReview, MoviesPage } from "~/server/movies";
import { MovieCard } from "~/components/MovieCard";
import { MediaListPage } from "~/components/MediaListPage";
import { createInfiniteOptions } from "~/lib/query-options";
import { Severity, useNotification } from "~/components/notifications";

export const moviesQueryOptions = (userId: string, filter?: string) =>
    createInfiniteOptions("movies", userId, filter, getPageMovies, (p) => p.movies);

export const Route = createFileRoute("/$userId/movies")({
    loaderDeps: ({ search }) => ({ filter: search.filter }),
    loader: async ({ context: { queryClient, user }, params: { userId }, deps: { filter } }) => {
        await queryClient.prefetchInfiniteQuery(moviesQueryOptions(userId, filter));
        return ({ pageName: user?._id === userId ? "My Movies" : "User's Movies", isFilter: true });
    },
    component: () => {
        const { userId } = Route.useParams();
        const { filter } = Route.useSearch();
        const { user } = Route.useRouteContext();
        const queryClient = useQueryClient();
        const notify = useNotification();

        const deleteMutation = useMutation({
            mutationFn: deleteMovie,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["movies", userId] });
                notify({ message: "Movie deleted", severity: Severity.MSG });
            },
            onError: (err) => notify({ message: err.message, severity: Severity.ERR }),
        });

        return (
            <MediaListPage<MoviesPage, MovieReview>
                userId={userId}
                currentUserId={user?._id}
                queryOptions={moviesQueryOptions(userId, filter)}
                newLink="/movies/new"
                itemTypeLabel="movie"
                getItems={(page) => page.movies}
                onConfirmDelete={(movie) => deleteMutation.mutate({ data: { movieId: movie._id } })}
                renderItem={(movie, openDeleteModal) => (
                    <MovieCard
                        key={movie._id}
                        movie={movie}
                        userId={user?._id}
                        onDeleteMovie={openDeleteModal}
                    />
                )}
            />
        );
    }
});
