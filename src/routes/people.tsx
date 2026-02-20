import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPeopleFn } from "~/server/users";

export const peopleQueryOptions = () =>
    queryOptions({
        queryKey: ["people"],
        queryFn: async () => getPeopleFn(),
        staleTime: 1000 * 60,
    });

export const Route = createFileRoute("/people")({
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(peopleQueryOptions()),
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
        <pre className="p-2">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
