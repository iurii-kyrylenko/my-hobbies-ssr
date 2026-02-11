import { createServerFn } from "@tanstack/react-start";
import { connectToDatabase } from "../lib/db";
import { ObjectId } from "mongodb";

interface MovieDoc {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    year: string;
    notes: string;
    completed: Date;
    imdbId: string;
}

interface Movie {
    _id: string;
    userId: string;
    title: string;
    year: string;
    notes: string;
    completed: string;
    imdbId: string;
}

export interface MoviesPage {
    movies: Movie[];
    page: number;
}

export const pageSize = 4;

export const getPageMovies = createServerFn({ method: 'GET' })
    .inputValidator((d: { userId: string, filter?: string, page: number }) => d)
    .handler(async ({ data }): Promise<MoviesPage> => {
        const skipAmount = (data.page - 1) * pageSize;

        const db = await connectToDatabase();

        const documents = await db
            .collection<MovieDoc>("movies")
            .find({
                userId: new ObjectId(data.userId),
                ...filterCondition(data.filter),
            })
            .sort({ completed: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .toArray();

        const movies = documents.map((movie) => ({
            ...movie,
            _id: movie._id.toString(),
            userId: movie.userId.toString(),
            completed: movie.completed.toISOString(),
        }));

        return { movies, page: data.page };
    });

const filterCondition = (filter?: string) => {
    let condition = {};

    if (filter) {
        const match = filter.match(/^c\s*(\d\d\d\d)/)?.[1];
        const year = match ? parseInt(match) : null;
        if (year) {
            condition = {
                completed: {
                    $gte: new Date(year.toString()),
                    $lt: new Date((year + 1).toString()),
                },
            };
        } else {
            const re = new RegExp(filter, "i");
            condition = {
                $or: [
                    { title: re },
                    { year: re },
                    { notes: re },
                ],
            };
        }
    }

    return condition;
};
