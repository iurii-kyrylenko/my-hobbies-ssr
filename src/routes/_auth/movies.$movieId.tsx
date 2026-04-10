import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { MovieForm, MovieFormData, FormDataChangeEvent } from "~/components/MovieForm";
import { Severity, useNotification } from "~/components/notifications";
import { getMovie, updateMovie } from "~/server/movies";

export const Route = createFileRoute("/_auth/movies/$movieId")({
    loader: async ({ context, params }) => ({
        data: await getMovie({
            data: {
                movieId: params.movieId,
                userId: context.user._id,
            },
        }),
        pageName: "Update Movie",
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();
    const navigate = Route.useNavigate();
    const { movieId } = Route.useParams();
    const router = useRouter();

    const { data } = Route.useLoaderData();
    const notify = useNotification();

    const mutation = useMutation({
        mutationFn: updateMovie,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["movies", user._id] }),
                queryClient.invalidateQueries({ queryKey: ["graph", "movie", movieId] }),
            ]);

            navigate({
                to: "/$userId/movies",
                params: { userId: user._id }
            });

            notify({ message: "A movie was modified", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const [formData, setFormData] = React.useState<MovieFormData>(data);

    const handleChange = (e: FormDataChangeEvent) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        mutation.mutate({
            data: {
                _id: movieId,
                userId: user._id,
                ...formData,
            },
        });
    };

    return (
        <MovieForm
            data={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}
