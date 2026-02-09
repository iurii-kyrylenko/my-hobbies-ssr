import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getAllBooks } from "~/server/books";


export const booksQueryOptions = () =>
    queryOptions({
        queryKey: ['books_ssr'],
        queryFn: getAllBooks,
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/books_ssr")({
    component: RouteComponent,
    loader: async ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(booksQueryOptions()),
});

function RouteComponent() {
    const data = Route.useLoaderData();

    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
