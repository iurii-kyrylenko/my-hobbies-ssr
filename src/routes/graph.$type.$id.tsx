import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getGraphSvg } from "~/server/graph";

const graphQueryOptions = (params: { type: string, id: string }) => queryOptions({
    queryKey: ["graph", params.type, params.id],
    queryFn: () => getGraphSvg({ data: params }),
    staleTime: Infinity,
    retry: false,
});

export const Route = createFileRoute('/graph/$type/$id')({
    loader: async ({ context: { queryClient }, params }) => ({
        data: await queryClient.ensureQueryData(graphQueryOptions(params)),
        pageName: "Storyline Graph",
    }),
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

    const panZoomRef = useRef<any>(null);

    useEffect(() => {
        let resizeListener: (() => void) | null = null;

        const init = async () => {
            const container = document.getElementById("graph-container");
            const svgElement = container?.querySelector("svg");

            if (!svgElement) return;

            const { default: svgPanZoom } = await import("svg-pan-zoom");

            panZoomRef.current = svgPanZoom(svgElement, {
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
            panZoomRef.current?.destroy();
            panZoomRef.current = null;
            if (resizeListener) window.removeEventListener("resize", resizeListener);
        };
    }, [data]);

    return (
        <div className="dark:invert dark:hue-rotate-180 w-full max-w-5xl mx-auto overflow-hidden border border-slate-300 rounded-xl shadow-sm">
            <div
                id="graph-container"
                className="w-full h-[86vh] flex items-center justify-center p-2
                    [&>svg]:w-full [&>svg]:h-full [&>svg]:block
                    [&_.node]:cursor-pointer [&_.node]:transition-opacity [&_.node]:hover:opacity-80"
                dangerouslySetInnerHTML={{ __html: data ?? "" }}
            />
        </div>
    );
}
