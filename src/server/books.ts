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
}

interface Book {
    _id: string;
    userId: string;
    title: string;
    author: string;
    completed: string;
    mode: string;
    googleBookId: string;
}

export interface BooksPage {
    books: Book[];
    page: number;
}

export const pageSize = 4;

export const getPageBooks = createServerFn({ method: 'GET' })
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
            .sort({ completed: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .toArray();

        const books = documents.map((book) => ({
            ...book,
            _id: book._id.toString(),
            userId: book.userId.toString(),
            completed: book.completed.toISOString(),
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
            const re = new RegExp(filter, "i")
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
