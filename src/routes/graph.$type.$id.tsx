import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Severity, useNotification } from "~/components/notifications";
import { getGraphSvg } from "~/server/graph";


export const Route = createFileRoute('/graph/$type/$id')({
    loader: () => ({ pageName: "Storyline Graph" }),
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const notify = useNotification();

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["graph", params.type, params.id],
        queryFn: () => getGraphSvg({ data: params }),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        // Guard: Only run if we actually have the SVG data in the DOM
        if (!data) return;

        let panZoomInstance: any = null;

        // Helper to handle the window resize event
        const handleResize = () => {
            if (panZoomInstance) {
                panZoomInstance.resize();
                panZoomInstance.fit();
                panZoomInstance.center();
            }
        };

        // Ensure the library is only loaded on the client.
        import("svg-pan-zoom").then((svgPanZoom) => {
            const container = document.getElementById("graph-container");
            const svgElement = container?.querySelector("svg");

            if (svgElement) {
                panZoomInstance = svgPanZoom.default(svgElement, {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
                    fit: true,
                    center: true,
                    refreshRate: 'auto', // Important for smooth resizing
                });

                window.addEventListener("resize", handleResize);
            }
        });

        return () => {
            panZoomInstance?.destroy();
            window.removeEventListener("resize", handleResize);
        };
    }, [data]);

    if (isError) {
        notify({ message: error.message, severity: Severity.ERR });
    }

    if (isLoading) {
        return (
            <div className="p-8 flex gap-2 opacity-70">
                <ArrowPathIcon className="size-5 animate-spin" />
                Loading...
            </div>
        )
    }

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
