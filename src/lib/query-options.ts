import { infiniteQueryOptions } from "@tanstack/react-query";
import { pageSize } from "~/server/constants";

export const createInfiniteOptions = <T extends { page: number }, R>(
    key: string,
    userId: string,
    filter: string | undefined,
    fetchFn: (args: { data: { userId: string; filter?: string; page: number } }) => Promise<T>,
    getItems: (page: T) => R[]
) =>
    infiniteQueryOptions({
        queryKey: [key, userId, filter],
        queryFn: ({ pageParam = 1 }) => fetchFn({ data: { userId, filter, page: pageParam } }),
        getNextPageParam: (lastPage) =>
            getItems(lastPage).length === pageSize ? lastPage.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.page > 1 ? firstPage.page - 1 : undefined,
        maxPages: 3,
        initialPageParam: 1,
        staleTime: 1000 * 60,
    });
