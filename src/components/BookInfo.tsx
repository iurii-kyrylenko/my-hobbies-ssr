import { getBookInfo } from "~/server/bookInfo";
import { useQuery } from "@tanstack/react-query";
import { Severity, useNotification } from "./notifications";

export function BookInfo({
    author,
    title,
    googleBookId,
}: {
    author: string,
    title: string,
    googleBookId: string,
}) {
    const { data, isError, error } = useQuery({
        queryKey: ["bookInfo", author, title, googleBookId],
        queryFn: () => getBookInfo({ data: { author, title, googleBookId } }),
        staleTime: Infinity,
        retry: false,
    });

    const notify = useNotification();

    if (isError) {
        notify({ message: error.message, severity: Severity.ERR });
    }

    return (
        <>
            <img src={data?.thumbnail} />
            <div
                className="mt-2 text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
            />
        </>
    );
}
