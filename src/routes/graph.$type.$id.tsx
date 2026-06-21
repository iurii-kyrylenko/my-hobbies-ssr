import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react";
import { ArrowPathIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { getGraphSvg } from "~/server/components/getGraphSvg";
import { CompositeComponent } from "@tanstack/react-start/rsc";
import { Severity, useNotification } from "~/components/notifications";
import { useSvgPanZoom } from "~/components/useSvgPanZoom";

const graphQueryOptions = (params: { type: string, id: string }) => queryOptions({
    queryKey: ["graph", params.type, params.id],
    structuralSharing: false,
    queryFn: () => getGraphSvg({ data: params }),
    staleTime: Infinity,
    retry: false,
});

export const Route = createFileRoute('/graph/$type/$id')({
    loader: async ({ context: { queryClient }, params }) => {
        await queryClient.ensureQueryData(graphQueryOptions(params));
        return { pageName: "Storyline Graph" };
    },
    component: RouteComponent,
    pendingComponent: () => {
        return (
            <div className="p-8 flex gap-2 opacity-70">
                <ArrowPathIcon className="size-5 animate-spin" />
                Loading...
            </div>
        );
    },
});

function RouteComponent() {
    const params = Route.useParams();
    const { data: src, isError, error } = useSuspenseQuery(graphQueryOptions(params));
    useSvgPanZoom(src);
    const [copied, setCopied] = useState(false);
    const notify = useNotification();

    if (isError) {
        notify({ message: error.message, severity: Severity.ERR })
    }

    return (
        <div className="dark:invert dark:hue-rotate-180 w-full max-w-5xl mx-auto overflow-hidden border border-slate-300 rounded-xl shadow-sm">
            <CompositeComponent src={src} copyButton={({ inputString }) =>
                <button
                    className="text-gray-100 bg-gray-400 hover:bg-gray-900 opacity-80 p-1 rounded-md"
                    onClick={() => {
                        navigator.clipboard?.writeText(inputString);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                    }}
                >
                    {copied ?
                        <ArrowPathIcon className="size-6 animate-spin" /> :
                        <ClipboardIcon className="size-6 stroke-2" />}
                </button>
            } />
        </div>
    );
}
