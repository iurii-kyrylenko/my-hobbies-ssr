import { createServerFn } from "@tanstack/react-start";
import { connectToDatabase } from "../lib/db";
import { ObjectId } from "mongodb";

interface BookDoc {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    author: string;
    completed: Date;
    mode: string;
    googleBookId: string;
    storyline: string;
}

export interface Book {
    _id: string;
    userId: string;
    title: string;
    author: string;
    completed: string;
    mode: string;
    googleBookId: string;
    storyline: string;
}

export interface BooksPage {
    books: Book[];
    page: number;
}

interface CreateBook {
    userId: string;
    title: string;
    author: string;
    completed: Date;
    mode: string;
    googleBookId: string;
    storyline: string;
}

export const pageSize = 12;

export const getPageBooks = createServerFn({ method: "GET" })
    .inputValidator((d: { userId: string, filter?: string, page: number }) => d)
    .handler(async ({ data }): Promise<BooksPage> => {
        const skipAmount = (data.page - 1) * pageSize;

        const db = await connectToDatabase();

        const documents = await db
            .collection<BookDoc>("books")
            .find({
                userId: new ObjectId(data.userId),
                ...filterCondition(data.filter),
            })
            .sort({ completed: -1, _id: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .toArray();

        const books = documents.map((book) => ({
            ...book,
            _id: book._id.toString(),
            userId: book.userId.toString(),
            completed: book.completed.toISOString().substring(0, 10),
        }));

        return { books, page: data.page };
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
                    { author: re },
                    { title: re },
                ],
            };
        }
    }

    return condition;
};

export const getBook = createServerFn({ method: "GET" })
    .inputValidator((data: { bookId: string, userId: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        const document = await db.collection<BookDoc>("books")
            .findOne({ _id: new ObjectId(data.bookId), userId: new ObjectId(data.userId) });

        if (!document) {
            throw new Error(`Book '${data.bookId}' not found`);
        }

        return {
            author: document.author,
            title: document.title,
            googleBookId: document.googleBookId,
            mode: document.mode,
            completed: document.completed.toISOString().substring(0, 10),
            storyline: document.storyline ?? "",
        };
    });

export const updateBook = createServerFn({ method: "POST" })
    .inputValidator((data: Book) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection<BookDoc>("books")
            .updateOne(
                { _id: new ObjectId(data._id), userId: new ObjectId(data.userId) },
                {
                    $set: {
                        title: data.title,
                        author: data.author,
                        completed: new Date(data.completed),
                        mode: data.mode,
                        googleBookId: data.googleBookId,
                        storyline: data.storyline,
                    },
                }
            );
    });

export const createBook = createServerFn({ method: "POST" })
    .inputValidator((data: CreateBook) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection<Omit<BookDoc, '_id'>>("books")
            .insertOne({ ...data, userId: new ObjectId(data.userId) });
    });

export const deleteBook = createServerFn({ method: "POST" })
    .inputValidator((data: { bookId: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection<BookDoc>("books")
            .deleteOne({ _id: new ObjectId(data.bookId) });
    });
