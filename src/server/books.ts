import { createServerFn } from "@tanstack/react-start";
import { connectToDatabase } from "../lib/db";

export interface Book {
    _id: string;
    userId: string;
    title: string;
    author: string;
    completed: string;
    mode: string;
    googleBookId: string;
}

export const getAllBooks = createServerFn({ method: 'GET' })
    .handler(async () => {
        const db = await connectToDatabase();

        const books = await db
            .collection<Book>("books")
            .find()
            .sort({ _id: -1 })
            .limit(10)
            .toArray();

        return books.map((book) => ({
            ...book,
            _id: book._id.toString(),
            userId: book.userId.toString(),
        }));
    }); 
