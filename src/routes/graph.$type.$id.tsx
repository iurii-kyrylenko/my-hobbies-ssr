import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getGraphSvg } from "~/server/components/getGraphSvg";

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
    const { data } = useQuery(graphQueryOptions(params));
    const rsc = data?.rsc;

    const panZoomRef = useRef<any>(null);

    // Pan / Zoom support
    useEffect(() => {
        // The flag used in "Ignore Pattern" to prevent race condition
        let ignore = false;

        let resizeListener: (() => void) | null = null;

        const init = async () => {
            const container = document.getElementById("graph-container");
            const svgElement = container?.querySelector("svg");
            if (!svgElement) return;

            const module = await import("svg-pan-zoom");
            if (ignore) return; // Ignore stale resolution

            panZoomRef.current = module.default(svgElement, {
                zoomEnabled: true,
                controlIconsEnabled: true,
                fit: true,
                center: true,
            });

            resizeListener = () => {
                try {
                    panZoomRef.current?.resize().fit().center();
                } catch (e) {
                    // Keeps the console clean during extreme window resizing
                    // console.warn(e);
                }
            };

            window.addEventListener("resize", resizeListener);
        };

        init();

        return () => {
            ignore = true; // Mark as stale
            panZoomRef.current?.destroy();
            panZoomRef.current = null;
            if (resizeListener) window.removeEventListener("resize", resizeListener);
        };
    }, [rsc]);

    return (
        <div className="dark:invert dark:hue-rotate-180 w-full max-w-5xl mx-auto overflow-hidden border border-slate-300 rounded-xl shadow-sm">
            {rsc}
        </div>
    );
}
