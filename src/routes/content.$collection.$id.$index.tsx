import { ArrowPathIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CompositeComponent } from "@tanstack/react-start/rsc";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { Severity, useNotification } from "~/components/notifications";
import { getContentSvg } from "~/server/components/getContentSvg";

const contentQueryOptions = (params: { collection: "books" | "movies", id: string, index: number }) => queryOptions({
    queryKey: ["content", params.collection, params.id, params.index],
    structuralSharing: false,
    queryFn: () => getContentSvg({ data: params }),
    staleTime: Infinity,
    retry: false,
});

export const Route = createFileRoute("/content/$collection/$id/$index")({
    parseParams: (rawParams) => ({
        id: z.string().parse(rawParams.id),
        collection: z.enum(["books", "movies"]).parse(rawParams.collection),
        index: z.coerce.number().parse(rawParams.index),
    }),
    loader: async ({ context: { queryClient }, params }) => {
        await queryClient.ensureQueryData(contentQueryOptions(params));
        return { pageName: "Storyline" };
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
})

function RouteComponent() {
    const params = Route.useParams();
    const { data: src, isError, error } = useSuspenseQuery(contentQueryOptions(params));
    const panZoomRef = useRef<any>(null);
    const [copied, setCopied] = useState(false);
    const notify = useNotification();

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
    }, [src]);

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
