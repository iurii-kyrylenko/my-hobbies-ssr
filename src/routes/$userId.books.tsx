import { infiniteQueryOptions, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { BooksPage, deleteBook, getPageBooks, pageSize } from "~/server/books";
import { useInView } from "react-intersection-observer";
import { BookCard } from "~/components/BookCard";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import { Severity, useNotification } from "~/components/notifications";

interface BookToDelete {
    _id: string;
    title: string;
}

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
        return ({ pageName: user?._id === userId ? "My Books" : "User's Books", isFilter: true });
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

    const notify = useNotification();

    const deleteBookMutation = useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["books", user?._id] });
            notify({ message: "A book was deleted", severity: Severity.MSG });
        },
    });

    const [bookToDelete, setBookToDelete] = React.useState<BookToDelete | null>(null);

    const handleDelete = () => {
        bookToDelete && deleteBookMutation.mutate({ data: { bookId: bookToDelete._id } });
        setBookToDelete(null);
    };

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            {user?._id === userId
                ? <Link
                    className="fixed z-10 up-6 right-6 size-12 text-2xl rounded-full bg-blue-400/80 text-white shadow-lg flex items-center justify-center transition-colors"
                    to="/books/new">+</Link>
                : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 gap-4 items-start">
                {data?.pages.map((page) => (
                    <React.Fragment key={page.page}>
                        {page.books.map((book) =>
                            <BookCard
                                key={book._id}
                                book={book}
                                userId={user?._id}
                                onDeleteBook={() => setBookToDelete(book)}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

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

            <ConfirmationDialog
                isOpen={!!bookToDelete}
                onClose={() => setBookToDelete(null)}
                onConfirm={handleDelete}
                message={`Do you want to delete book "${bookToDelete?.title}"?`}
            />
        </>
    );
}
