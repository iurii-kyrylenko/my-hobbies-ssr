import { useEffect, useState } from "react";

// A module-level cache that lives outside the hook lifecycle
let globalPrismInstance: any = null;

export function useHighlight() {
    // Initialize state directly from the cache if it's already available
    const [prismInstance, setPrismInstance] = useState<any>(globalPrismInstance);

    useEffect(() => {
        // If it's already globally loaded, do nothing
        if (globalPrismInstance) return;

        if (typeof window !== "undefined") {
            (async () => {
                const prism = await import("prismjs");
                await import("prismjs/components/prism-dot" as any);
                await import("prismjs/components/prism-mermaid" as any);

                const instance = prism.default || prism;
                globalPrismInstance = instance; // Store in global cache
                setPrismInstance(instance);
            })();

            import("prismjs/themes/prism-tomorrow.css" as any);
        }
    }, []);

    const highlight = (code: string): string => {
        if (!prismInstance) return code;

        return code.startsWith("%% mmd")
            ? prismInstance.highlight(code, prismInstance.languages.mermaid, "mermaid")
            : prismInstance.highlight(code, prismInstance.languages.dot, "dot");
    };

    return { highlight } as const;
}
