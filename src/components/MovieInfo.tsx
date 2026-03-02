import { getMovieInfo } from "~/server/movieInfo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function MovieInfo({ imdbId }: { imdbId: string }) {
    const { data, isError, error } = useQuery({
        queryKey: ["movieInfo", imdbId],
        queryFn: () => getMovieInfo({ data: { imdbId } }),
        staleTime: Infinity,
        retry: false,
    });

    const queryClient = useQueryClient();

    if (isError) {
        queryClient.setQueryData(["message"], () => error.message);
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
