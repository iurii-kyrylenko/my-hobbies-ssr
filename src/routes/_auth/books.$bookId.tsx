import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";
import { BookForm, BookFormData, FormDataChangeEvent } from "~/components/BookForm";
import { Severity, useNotification } from "~/components/notifications";
import { getBook, updateBook } from "~/server/books";

export const Route = createFileRoute("/_auth/books/$bookId")({
    loader: async ({ context, params }) => ({
        data: await getBook({
            data: {
                bookId: params.bookId,
                userId: context.user._id,
            },
        }),
        pageName: "Update Book",
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const { user, queryClient } = Route.useRouteContext();
    const navigate = Route.useNavigate();
    const { bookId } = Route.useParams();
    const router = useRouter();

    const { data } = Route.useLoaderData();
    const notify = useNotification();

    const mutation = useMutation({
        mutationFn: updateBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books", user._id] });

            navigate({
                to: "/$userId/books",
                params: { userId: user._id }
            });

            notify({ message: "A book was modified", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
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
            data={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}
