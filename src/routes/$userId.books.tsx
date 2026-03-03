import { infiniteQueryOptions, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { BooksPage, deleteBook, getPageBooks, pageSize } from "~/server/books";
import { useInView } from "react-intersection-observer";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BookInfo } from "~/components/BookInfo";

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

    const handleDelete = (book: { _id: string, title: string }) => {
        if (confirm(`Do you want to delete book\n "${book.title}"?`)) {
            deleteBookMutation.mutate({ data: { bookId: book._id } });
        }
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

            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-4 gap-4 items-start">
                {data?.pages.map((page) => (
                    <React.Fragment key={page.page}>
                        {page.books.map((book) => (
                            <div
                                className="p-2 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50"
                                key={book._id}
                            >
                                <div className="m-2 flex flex-col opacity-85">
                                    <div className="text-sm font-bold">{book.title}</div>
                                    <div className="text-sm font-medium text-blue-500">by {book.author}</div>
                                    <div className="text-sm">
                                        {book.mode === "r" ? "REGULAR" : book.mode === "a" ? "AUDIO" : "MIXED"}
                                        {" | "}
                                        Read on {book.completed}
                                    </div>
                                </div>

                                <Disclosure as="div" className="border rounded-md p-2">
                                    <DisclosureButton className="group flex w-full items-center justify-between hover:cursor-pointer">
                                        <span className="text-sm">
                                            Details...
                                        </span>
                                        <ChevronDownIcon className="size-5 text-blue-400 group-data-open:rotate-180" />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                                        <BookInfo {...book} />
                                    </DisclosurePanel>
                                </Disclosure>

                                {user?._id === book.userId &&
                                    <div className="m-2 mt-4 flex gap-6">
                                        <Link className="hover:underline" to="/books/$bookId" params={{ bookId: book._id }}>
                                            <PencilIcon className="size-5 text-blue-400" />
                                        </Link>
                                        <button
                                            className="cursor-pointer hover:underline"
                                            onClick={() => handleDelete(book)}
                                        >
                                            <TrashIcon className="size-5 text-blue-400" />
                                        </button>
                                    </div>}
                            </div>
                        ))}
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
        </>
    );
}
