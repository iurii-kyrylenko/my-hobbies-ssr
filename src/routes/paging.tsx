// Summary of the Lifecycle:
//
// 1. Server-Side: The loader prefetches the data, ensuring the HTML
//    sent to the browser is fully populated with your first page of users.
//
// 2. Hydration: TanStack Start seamlessly transfers that cache state
//    to the browser.
//
// 3. Client-Side: useInfiniteQuery sees the "fresh" data in the cache
//    and waits until the staleTime expires (or you scroll to trigger
//    a new page) before making another network request.

import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

type UsersResults = {
    results: { login: { uuid: string, username: string } }[],
    info: { page: number },
}

const apiUrl = "https://randomuser.me/api/?&seed=123&inc=login&results=5";

export const usersQueryOptions = () =>
    infiniteQueryOptions({
        queryKey: ['users'],
        queryFn: async ({ pageParam = 1 }): Promise<UsersResults> => {
            const res = await fetch(`${apiUrl}&page=${pageParam}`);
            return res.json();
        },
        getNextPageParam: (lastPage) =>
            lastPage.info.page < 10 ? lastPage.info.page + 1 : undefined,
        initialPageParam: 1,
        // The default staleTime is 0. This means that as soon
        // as the client-side useInfiniteQuery mounts, it sees
        // the data in the cache but immediately marks it as stale
        // and triggers a background refetch to ensure the data is
        // up-to-date. This effectively causes the double-fetching
        // of the 1st page both by server and client.
        // So we overwrite the defaul behaviour:
        staleTime: 1000 * 60, // Data remains fresh for 1 minute.
    });

export const Route = createFileRoute("/paging")({
    loader: async ({ context: { queryClient } }) => {
        // Prefetch the first page on the server
        await queryClient.prefetchInfiniteQuery(usersQueryOptions());
    },
    component: RouteComponent,
});

function RouteComponent() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(usersQueryOptions())

    return (
        <div className="m-4">
            {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.results.map((user) => (
                        <p key={user.login.uuid}>{user.login.username}</p>
                    ))}
                </React.Fragment>
            ))}

            <button
                className="mt-2"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? "Loading..."
                    : hasNextPage ? "Load More" : "Nothing more to load"
                }
            </button>
        </div>
    );
}
