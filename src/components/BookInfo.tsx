import { getBookInfo } from "~/server/bookIinfo";
import { useQuery } from "@tanstack/react-query";

export function BookInfo({
    author,
    title,
    googleBookId,
}: {
    author: string,
    title: string,
    googleBookId: string,
}) {
    const { data } = useQuery({
        queryKey: ["bookInfo", author, title, googleBookId],
        queryFn: () => getBookInfo({ data: { author, title, googleBookId } }),
        staleTime: Infinity,
    });

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
