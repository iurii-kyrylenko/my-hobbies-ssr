import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { createBook } from "~/server/books";

export const Route = createFileRoute("/_auth/books/new")({
    component: RouteComponent,
})

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: createBook,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["books", user._id] });
            navigate({
                to: "/$userId/books",
                params: { userId: user._id }
            });
        },
        onError: (error) => {
            queryClient.setQueryData(["message"], () => error.message);
        },
    });

    const handleUpdate = () => {
        mutation.mutate({
            data: {
                userId: user._id,
                title: "The Problem of the Green Capsule (The Black Spectacles) (GF-10)",
                author: "John Dickson Carr",
                completed: new Date(new Date().setHours(0, 0, 0, 0)),
                mode: "r",
                googleBookId: "DOka0AEACAAJ",
            }
        });
    };

    return (
        <div>
            <button
                className="hover:underline"
                onClick={handleUpdate}
            >
                Add book
            </button>
        </div>
    );
}
