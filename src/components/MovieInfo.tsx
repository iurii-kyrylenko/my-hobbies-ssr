import { getMovieInfo } from "~/server/movieInfo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Severity, useNotification } from "./notifications";

export function MovieInfo({ imdbId }: { imdbId: string }) {
    const { data, isError, error } = useQuery({
        queryKey: ["movieInfo", imdbId],
        queryFn: () => getMovieInfo({ data: { imdbId } }),
        staleTime: Infinity,
        retry: false,
    });

    const notify = useNotification();

    if (isError) {
        notify({ message: error.message, severity: Severity.ERR });
    }

    return (
        <>
            <img src={data?.poster} />
            <div className="mt-2 text-gray-600 dark:text-gray-400">
                {data?.plot}
            </div>
        </>
    );
}
