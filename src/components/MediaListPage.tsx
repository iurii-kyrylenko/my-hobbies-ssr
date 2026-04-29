import React from "react";
import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    InfiniteData,
    useQueryClient
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import { PageUp } from "~/components/PageUp";
import { useJumpToTop } from "~/components/useJumpToTop";
import ConfirmationDialog from "~/components/ConfirmationDialog";

interface MediaListPageProps<TPage, TItem> {
    userId: string;
    currentUserId?: string;
    // 5 type arguments: TQueryFnData, TError, TData, TQueryKey, TPageParam
    // We use 'any' for the last two to prevent 'readonly' array variance errors
    queryOptions: UseInfiniteQueryOptions<TPage, Error, InfiniteData<TPage>, any, any>;
    newLink: string;
    itemTypeLabel: string;
    renderItem: (item: TItem, openDeleteModal: () => void) => React.ReactNode;
    getItems: (page: TPage) => TItem[];
    onConfirmDelete: (item: TItem) => void;
}

export function MediaListPage<
    TPage extends { page: number },
    TItem extends { _id: string; title: string }
>({
    userId,
    currentUserId,
    queryOptions,
    newLink,
    itemTypeLabel,
    renderItem,
    getItems,
    onConfirmDelete
}: MediaListPageProps<TPage, TItem>) {
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();
    const [itemToDelete, setItemToDelete] = React.useState<TItem | null>(null);

    const query = useInfiniteQuery(queryOptions);
    const { jump, isJumping } = useJumpToTop(queryClient, queryOptions);

    React.useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    }, [inView, query.hasNextPage, query.isFetchingNextPage]);

    return (
        <>
            {currentUserId === userId && (
                <Link
                    className="fixed z-10 top-20 right-6 size-12 text-2xl rounded-full border-2 border-blue-400 flex items-center justify-center opacity-60"
                    to={newLink}
                >
                    +
                </Link>
            )}

            {query.hasPreviousPage && (
                <PageUp
                    isDisabled={query.isFetchingPreviousPage || isJumping}
                    onTop={jump}
                    onUp={query.fetchPreviousPage}
                />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 gap-4 items-start">
                {query.data?.pages.map((page) => (
                    <React.Fragment key={page.page}>
                        {getItems(page).map((item) => renderItem(item, () => setItemToDelete(item)))}
                    </React.Fragment>
                ))}
            </div>

            <button
                ref={ref}
                className="mb-16 p-2 border rounded-md"
                disabled={!query.hasNextPage || query.isFetchingNextPage}
            >
                {query.isFetchingNextPage ? "Loading..." : query.hasNextPage ? "Load next page" : "Last page"}
            </button>

            <ConfirmationDialog
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) onConfirmDelete(itemToDelete);
                    setItemToDelete(null);
                }}
                message={`Do you want to delete ${itemTypeLabel} "${itemToDelete?.title}"?`}
            />
        </>
    );
}
