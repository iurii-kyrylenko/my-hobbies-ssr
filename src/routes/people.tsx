import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
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
    const data = Route.useLoaderData();
    return (
        <pre className="p-2">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
