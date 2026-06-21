import { SparklesIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { extrasQueryOptions } from "./_auth/extras.$collection.$id";

export const Route = createFileRoute("/extras-pub/$collection/$id")({
    parseParams: (rawParams) => ({
        id: z.string().parse(rawParams.id),
        collection: z.enum(["books", "movies"]).parse(rawParams.collection),
    }),
    loader: async ({ params, context: { queryClient } }) => {
        await queryClient.ensureQueryData(extrasQueryOptions(params.collection, params.id));
        return { pageName: "Extra content" };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const params = Route.useParams();
    const { data } = useSuspenseQuery(extrasQueryOptions(params.collection, params.id));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 gap-4 items-start">
            {data.map((extra) => (
                <div
                    className="p-3 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50 flex flex-col gap-4"
                    key={extra.id}
                >
                    <Link
                        className="cursor-pointer flex gap-2"
                        to="/content/$collection/$id/$index"
                        params={{ ...params, index: extra.id }}
                    >
                        <SparklesIcon className="size-5 text-blue-400" />
                        <span className="text-sm hover:underline">{extra.title}</span>
                    </Link>
                </div>)
            )}
        </div>
    );
}
