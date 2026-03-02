import { createServerFn } from "@tanstack/react-start";

interface MovieEntry {
    overview: string;
    poster_path: string;
}

interface TMDBResult {
    movie_results: MovieEntry[];
    tv_results: MovieEntry[];
}

interface MovieSearchResult {
    found: boolean;
    plot?: string;
    poster?: string;
}

const getResultFromTmdbFind = (tmdb: TMDBResult) => {
    return getResultFromTmdb([...tmdb.movie_results, ...tmdb.tv_results]);
};

const getResultFromTmdb = (entries: MovieEntry[]) => {
    if (!entries.length) {
        return { found: false };
    }
    const entry = entries[0];
    return { found: true, plot: entry.overview, poster: getPosterUrl(entry.poster_path) };
};

const getPosterUrl = (path: string) => {
    // Supported formats:
    // w92, w154, w185, w342, w500, w780, original
    return `${process.env.TMDB_IMAGE_STORE}w185${path}`;
};

export const getMovieInfo = createServerFn({ method: 'GET' })
    .inputValidator((d: { imdbId: string }) => d)
    .handler(async ({ data }): Promise<MovieSearchResult> => {
        const baseURL = process.env.TMDB_API;
        const url = new URL(`${baseURL}find/${data.imdbId}`);

        url.search = new URLSearchParams({
            api_key: process.env.TMDB_API_KEY!,
            external_source: "imdb_id",
        }).toString();

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`${res.status}: ${res.statusText}`);
        }

        const result: TMDBResult = await res.json();
        return getResultFromTmdbFind(result);
    });
