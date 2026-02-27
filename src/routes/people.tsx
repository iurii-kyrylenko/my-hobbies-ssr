import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import React from "react";
import { getPeopleFn } from "~/server/users";

export const peopleQueryOptions = () =>
    queryOptions({
        queryKey: ["people"],
        queryFn: async () => getPeopleFn(),
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/people")({
    loader: ({ context: { queryClient } }) =>
        ({ data: queryClient.ensureQueryData(peopleQueryOptions()), pageName: "People" }),
    component: RouteComponent,
})

function RouteComponent() {
    // Even though the data is loaded in the loader, we must call useQuery
    // inside the component. TanStack Query rehydrates the cache on the client and
    // useQuery hooks into that cached entry. When we call
    // queryClient.invalidateQueries({ queryKey: [...] }), the useQuery hook
    // detects the change and triggers a background refetch.
    const { data } = useQuery(peopleQueryOptions());

    return (
        <>
            {data?.map((user) => (
                <React.Fragment key={user._id}>
                    <pre>
                        {JSON.stringify(user, null, 2)}
                    </pre>
                    <div className="ml-12">
                        <Link className="hover:underline" to="/$userId/books" params={{ userId: user._id }}>
                            Show books
                        </Link>
                        {" | "}
                        <Link className="hover:underline" to="/$userId/movies" params={{ userId: user._id }}>
                            Show movies
                        </Link>
                    </div>
                </React.Fragment>)
            )}
        </>
    );
}
