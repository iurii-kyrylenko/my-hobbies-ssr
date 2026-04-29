import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPageBooks, deleteBook, BookReview, BooksPage } from "~/server/books";
import { BookCard } from "~/components/BookCard";
import { MediaListPage } from "~/components/MediaListPage";
import { createInfiniteOptions } from "~/lib/query-options";
import { Severity, useNotification } from "~/components/notifications";

export const booksQueryOptions = (userId: string, filter?: string) =>
    createInfiniteOptions("books", userId, filter, getPageBooks, (p) => p.books);

export const Route = createFileRoute("/$userId/books")({
    loaderDeps: ({ search }) => ({ filter: search.filter }),
    loader: async ({ context: { queryClient, user }, params: { userId }, deps: { filter } }) => {
        await queryClient.prefetchInfiniteQuery(booksQueryOptions(userId, filter));
        return ({ pageName: user?._id === userId ? "My Books" : "User's Books", isFilter: true });
    },
    component: () => {
        const { userId } = Route.useParams();
        const { filter } = Route.useSearch();
        const { user } = Route.useRouteContext();
        const queryClient = useQueryClient();
        const notify = useNotification();

        const deleteMutation = useMutation({
            mutationFn: deleteBook,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["books", userId] });
                notify({ message: "Book deleted", severity: Severity.MSG });
            },
            onError: (err) => notify({ message: err.message, severity: Severity.ERR }),
        });

        return (
            <MediaListPage<BooksPage, BookReview>
                userId={userId}
                currentUserId={user?._id}
                queryOptions={booksQueryOptions(userId, filter)}
                newLink="/books/new"
                itemTypeLabel="book"
                getItems={(page) => page.books}
                onConfirmDelete={(book) => deleteMutation.mutate({ data: { bookId: book._id } })}
                renderItem={(book, openDeleteModal) => (
                    <BookCard
                        key={book._id}
                        book={book}
                        userId={user?._id}
                        onDeleteBook={openDeleteModal}
                    />
                )}
            />
        );
    }
});
