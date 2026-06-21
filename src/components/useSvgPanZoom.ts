import { useEffect, useRef } from "react";

export function useSvgPanZoom(src: any) {
    const panZoomRef = useRef<any>(null);

    useEffect(() => {
        // The flag used in "Ignore Pattern" to prevent race condition
        let ignore = false;

        let resizeListener: (() => void) | null = null;

        const init = async () => {
            const container = document.getElementById("graph-container");
            const svgElement = container?.querySelector("svg");
            if (!svgElement) return;

            const module = await import("svg-pan-zoom" as any);
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
}