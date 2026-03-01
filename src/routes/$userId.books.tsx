import { infiniteQueryOptions, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { BooksPage, deleteBook, getPageBooks, pageSize } from "~/server/books";
import { useInView } from "react-intersection-observer";

export const booksQueryOptions = (userId: string, filter?: string) =>
    infiniteQueryOptions({
        queryKey: ["books", userId, filter],
        queryFn: async ({ pageParam = 1 }): Promise<BooksPage> => getPageBooks({
            data: {
                userId,
                filter,
                page: pageParam,
            },
        }),
        getNextPageParam: (lastPage) =>
            lastPage.books.length === pageSize ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/$userId/books")({
    loaderDeps: ({ search }) => ({
        filter: search.filter,
    }),
    loader: async ({ context: { queryClient, user }, params: { userId }, deps: { filter } }) => {
        // Prefetch the first page on the server
        await queryClient.prefetchInfiniteQuery(booksQueryOptions(userId, filter));
        return ({ pageName: user?._id === userId ? "My Books" : "User's Books" });
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { ref, inView } = useInView();

    const { userId } = Route.useParams();
    const { filter } = Route.useSearch();
    const { user, queryClient } = Route.useRouteContext();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(booksQueryOptions(userId, filter));

    const deleteBookMutation = useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["books", user?._id] });
        },
    });

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div>
            {user?._id === userId
                ? <Link
                    className="fixed up-6 right-6 size-12 text-2xl rounded-full bg-blue-400/80 text-white shadow-lg flex items-center justify-center transition-colors"
                    to="/books/new">+</Link>
                : null}

            {data?.pages.map((page) => (
                <React.Fragment key={page.page}>
                    {page.books.map((book) => (
                        <React.Fragment key={book._id}>
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(book, null, 2)}
                            </pre>
                            {user?._id === book.userId &&
                                <div className="ml-12">
                                    <Link className="hover:underline" to="/books/$bookId" params={{ bookId: book._id }}>
                                        Update
                                    </Link>
                                    {" | "}
                                    <button
                                        className="cursor-pointer hover:underline"
                                        onClick={() => deleteBookMutation.mutate({ data: { bookId: book._id } })}
                                    >
                                        Delete
                                    </button>
                                </div>}
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}

            <button
                ref={ref}
                className="mb-16 p-2 border rounded-md"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? "Loading..."
                    : hasNextPage
                        ? <span className="cursor-pointer hover:underline">Load More</span>
                        : "Nothing more to load"
                }
            </button>
        </div>
    );
}
