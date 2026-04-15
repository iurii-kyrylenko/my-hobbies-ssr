import {
    QueryClient,
    InfiniteData,
    QueryKey,
    UseInfiniteQueryOptions
} from "@tanstack/react-query";
import React from "react";

export function useJumpToTop<TData>(
    queryClient: QueryClient,
    // Use "any" for the rest of the generics to avoid TS2707 version conflicts
    queryOptions: Pick<UseInfiniteQueryOptions<TData, any, any, any, any>, "queryKey" | "queryFn">
) {
    const [isJumping, setIsJumping] = React.useState(false);

    const jump = React.useCallback(async () => {
        const { queryKey, queryFn } = queryOptions;

        if (typeof queryFn !== "function") return;

        setIsJumping(true);
        try {
            // Cast to any[] to ensure we can spread the key safely
            const queryKeyTmp = [...(queryKey as any[]), "tmp"];

            const firstPage = await queryClient.fetchQuery({
                queryKey: queryKeyTmp,
                queryFn: (context) => (queryFn as any)(context),
                staleTime: 0,
            });

            queryClient.setQueryData<InfiniteData<TData>>(queryKey as QueryKey, () => {
                return {
                    pages: [firstPage],
                    pageParams: [1],
                } as InfiniteData<TData>;
            });

            queryClient.removeQueries({ queryKey: queryKeyTmp });
        } catch (error) {
            console.error("Jump to top failed:", error);
        } finally {
            setIsJumping(false);
        }
    }, [queryClient, queryOptions]);

    return { jump, isJumping };
}
