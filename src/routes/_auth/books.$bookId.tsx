import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { BookForm, BookFormData, FormDataChangeEvent } from "~/components/BookForm";
import { getBook, updateBook } from "~/server/books";

export const Route = createFileRoute("/_auth/books/$bookId")({
    loader: ({ context, params }) => getBook({
        data: {
            bookId: params.bookId,
            userId: context.user._id,
        },
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();
    const navigate = Route.useNavigate();
    const { bookId } = Route.useParams();
    const router = useRouter();

    const data = Route.useLoaderData();

    const mutation = useMutation({
        mutationFn: updateBook,
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

    const [formData, setFormData] = React.useState<BookFormData>(data);

    const handleChange = (e: FormDataChangeEvent) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        mutation.mutate({
            data: {
                _id: bookId,
                userId: user._id,
                ...formData,
            },
        });
    };

    return (
        <BookForm
            header={"Update book"}
            data={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}
