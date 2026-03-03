import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { MovieForm, MovieFormData, FormDataChangeEvent } from "~/components/MovieForm";
import { createMovie } from "~/server/movies";

export const Route = createFileRoute("/_auth/movies/new")({
    loader: () => ({ pageName: "Add Movie" }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();
    const navigate = Route.useNavigate();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: createMovie,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["movies", user._id] }); // ???
            router.invalidate(); // ???

            navigate({
                to: "/$userId/movies",
                params: { userId: user._id }
            });
        },
        onError: (error) => {
            queryClient.setQueryData(["message"], () => error.message);
        },
    });

    const [formData, setFormData] = React.useState<MovieFormData>({
        title: "",
        year: "",
        notes: "",
        imdbId: "",
        completed: new Date().toISOString().substring(0, 10),
    });

    const handleChange = (e: FormDataChangeEvent) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        mutation.mutate({
            data: {
                userId: user._id,
                ...formData,
                completed: new Date(formData.completed),
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
