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

export const getAllBooks = createServerFn({ method: 'GET' })
    .handler(async (): Promise<Book[]> => {
        const db = await connectToDatabase();

        const books = await db
            .collection<BookDoc>("books")
            .find()
            .sort({ _id: -1 })
            .limit(10)
            .toArray();

        return books.map((book) => ({
            ...book,
            _id: book._id.toString(),
            userId: book.userId.toString(),
            completed: book.completed.toISOString(),
        }));
    });

const filterCondition = (filter: string) => {
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
}

export const getPageBooks = createServerFn({ method: 'GET' })
    .inputValidator((d: { userId: string, filter: string, page: number }) => d)
    .handler(async ({ data }): Promise<Book[]> => {
        const pageSize = 5;
        const skipAmount = (data.page - 1) * pageSize;

        const db = await connectToDatabase();

        const books = await db
            .collection<BookDoc>("books")
            .find({
                userId: new ObjectId(data.userId),
                ...filterCondition(data.filter),
            })
            .sort({ completed: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .toArray();

        return books.map((book) => ({
            ...book,
            _id: book._id.toString(),
            userId: book.userId.toString(),
            completed: book.completed.toISOString(),
        }));
    }); 
