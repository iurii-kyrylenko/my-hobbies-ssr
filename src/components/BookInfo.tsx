import { useQuery } from "@tanstack/react-query";
import { getBookInfo } from "~/server/bookInfo";
import { MediaInfoBase } from "./MediaInfoBase";

export function BookInfo({ author, title, googleBookId }: {
    author: string;
    title: string;
    googleBookId: string;
}) {
    const query = useQuery({
        queryKey: ["bookInfo", author, title, googleBookId],
        queryFn: () => getBookInfo({ data: { author, title, googleBookId } }),
        staleTime: Infinity,
        retry: false,
    });

    return (
        <MediaInfoBase
            query={query}
            imageUrl={query.data?.thumbnail}
            imageAlt={title}
            contentHtml={query.data?.description}
        />
    );
}
