import { useQuery } from "@tanstack/react-query";
import { getMovieInfo } from "~/server/movieInfo";
import { MediaInfoBase } from "./MediaInfoBase";

export function MovieInfo({ imdbId }: { imdbId: string }) {
    const query = useQuery({
        queryKey: ["movieInfo", imdbId],
        queryFn: () => getMovieInfo({ data: { imdbId } }),
        staleTime: Infinity,
        retry: false,
    });

    return (
        <MediaInfoBase
            query={query}
            imageUrl={query.data?.poster}
            imageAlt={imdbId}
            contentHtml={query.data?.plot}
        />
    );
}
