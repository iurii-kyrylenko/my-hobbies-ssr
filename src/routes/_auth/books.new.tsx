import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { BookForm, BookFormData, FormDataChangeEvent } from "~/components/BookForm";
import { createBook } from "~/server/books";

export const Route = createFileRoute("/_auth/books/new")({
    loader: () => ({ pageName: "Add Book" }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();
    const navigate = Route.useNavigate();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: createBook,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["books", user._id] }); // ???
            router.invalidate(); // ???

            navigate({
                to: "/$userId/books",
                params: { userId: user._id }
            });
        },
        onError: (error) => {
            queryClient.setQueryData(["message"], () => error.message);
        },
    });

    const [formData, setFormData] = React.useState<BookFormData>({
        author: "",
        title: "",
        googleBookId: "",
        mode: "r",
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
        <BookForm
            header={"Add book"}
            data={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}
