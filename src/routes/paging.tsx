
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
                {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
            </button>
        </div>
    );
}
