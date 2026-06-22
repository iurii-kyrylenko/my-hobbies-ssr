import { createServerFn } from "@tanstack/react-start";
import { connectToDatabase } from "../lib/db";
import { ObjectId } from "mongodb";
import { pageSize } from "./constants";

interface MovieDoc {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    year: string;
    notes: string;
    completed: Date;
    imdbId: string;
    extras: string[];
}

interface MovieAggr {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    year: string;
    notes: string;
    completed: Date;
    imdbId: string;
    extrasCount: number;
}

interface MovieBase {
    _id: string;
    userId: string;
    title: string;
    year: string;
    notes: string;
    completed: string;
    imdbId: string;
}

interface Movie extends MovieBase {
    extras: string[];
}

export interface MovieReview extends MovieBase {
    extrasCount: number;
}

export interface MoviesPage {
    movies: MovieReview[];
    page: number;
}

interface CreateMovie {
    userId: string;
    title: string;
    year: string;
    notes: string;
    completed: Date;
    imdbId: string;
}

export const getPageMovies = createServerFn({ method: "GET" })
    .inputValidator((d: { userId: string, filter?: string, page: number }) => d)
    .handler(async ({ data }): Promise<MoviesPage> => {
        const skipAmount = (data.page - 1) * pageSize;

        const db = await connectToDatabase();

        const documents = await db.collection("movies")
            .aggregate<MovieAggr>([
                {
                    $match: { userId: new ObjectId(data.userId), ...filterCondition(data.filter) }
                },
                {
                    $set: {
                        extrasCount: {
                            $cond: {
                                if: { $isArray: "$extras" },
                                then: { $size: "$extras" },
                                else: 0,
                            }
                        },
                    }
                },
                {
                    $unset: ["extras"],
                },
            ])
            .sort({ completed: -1, _id: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .toArray();

        const movies = documents.map((movie) => ({
            ...movie,
            _id: movie._id.toString(),
            userId: movie.userId.toString(),
            completed: movie.completed.toISOString().substring(0, 10),
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

export const getMovie = createServerFn({ method: "GET" })
    .inputValidator((data: { movieId: string, userId: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        const document = await db.collection("movies")
            .aggregate<MovieDoc>([
                { $match: { _id: new ObjectId(data.movieId), userId: new ObjectId(data.userId) } },
                { $unset: ["extras"] },
            ])
            .next();

        if (!document) {
            throw new Error(`Movie '${data.movieId}' not found`);
        }

        return {
            title: document.title,
            notes: document.notes,
            imdbId: document.imdbId,
            year: document.year,
            completed: document.completed.toISOString().substring(0, 10),
        };
    });

export const updateMovie = createServerFn({ method: "POST" })
    .inputValidator((data: Omit<Movie, "extras">) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection<MovieDoc>("movies")
            .updateOne(
                { _id: new ObjectId(data._id), userId: new ObjectId(data.userId) },
                {
                    $set: {
                        title: data.title,
                        notes: data.notes,
                        completed: new Date(data.completed),
                        year: data.year,
                        imdbId: data.imdbId,
                    },
                }
            );
    });

export const createMovie = createServerFn({ method: "POST" })
    .inputValidator((data: CreateMovie) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection<Omit<MovieDoc, "_id" | "extras">>("movies")
            .insertOne({ ...data, userId: new ObjectId(data.userId) });
    });

export const deleteMovie = createServerFn({ method: "POST" })
    .inputValidator((data: { movieId: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection<MovieDoc>("movies")
            .deleteOne({ _id: new ObjectId(data.movieId) });
    });
