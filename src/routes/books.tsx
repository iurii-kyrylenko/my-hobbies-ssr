import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getAllBooks } from "~/server/books";

export const Route = createFileRoute("/books")({
    component: RouteComponent,
});

function RouteComponent() {
    const{data: books} = useSuspenseQuery({
        queryKey:["books"],
        queryFn: getAllBooks,
    });

    return (
        <pre>
            {JSON.stringify(books, null, 2)}
        </pre>
    );
}
