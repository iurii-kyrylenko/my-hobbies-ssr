import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPageBooks } from "~/server/books";


export const booksQueryOptions = () =>
    queryOptions({
        queryKey: ["books"],
        queryFn: () => getPageBooks({
            data: {
                userId: "57a8ba0bd901937c0275bce5",
                filter: "c 2019",
                // filter: "tony",
                page: 1,
            },
        }),
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/books")({
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
