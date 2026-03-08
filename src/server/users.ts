import crypto from "crypto";
import { createServerFn } from "@tanstack/react-start";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "~/lib/db";
import { useAppSession } from "~/utils/session";
import { redirect } from "@tanstack/react-router";

interface UserDoc {
    _id: ObjectId;
    email: string;
    name: string;
    shareBooks: boolean;
    shareMovies: boolean;
    hash: string;
    salt: string;
}

interface User {
    _id: string;
    email: string;
    name: string;
    shareBooks: boolean;
    shareMovies: boolean;
}

interface UserInfoDoc {
    _id: ObjectId;
    name: string;
    shareBooks: boolean;
    shareMovies: boolean;
    books: number;
    movies: number;
    total: number;
}

export const registerFn = createServerFn({ method: "POST" })
    .inputValidator((data: { name: string; email: string; password: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        let user = await db
            .collection<UserDoc>("users")
            .findOne({ name: data.name });

        if (user) {
            throw new Error(`User "${data.name}" already registered!`);
        }

        user = await db
            .collection<UserDoc>("users")
            .findOne({ email: data.email });

        if (user) {
            throw new Error(`Email "${data.email}" already registered!`);
        }

        const hashData = hashPassword(data.password);

        const { insertedId } = await db.collection<Omit<UserDoc, '_id'>>("users")
            .insertOne({
                name: data.name,
                email: data.email,
                shareBooks: false,
                shareMovies: false,
                ...hashData,
            });

        // Create session
        const session = await useAppSession();
        await session.update({
            sub: insertedId.toString(),
            email: data.email,
            name: data.name,
        });

        throw redirect({ to: "/" });
    });

export const loginFn = createServerFn({ method: "POST" })
    .inputValidator((data: { name: string; password: string; redirectTo: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        const user = await db
            .collection<UserDoc>("users")
            .findOne({ name: data.name });

        if (!user) {
            throw new Error(`User ${data.name} is not registered`);
        }

        if (!checkPassword(data.password, user.hash, user.salt)) {
            throw new Error("Password does not match");
        }

        // Create session
        const session = await useAppSession();
        await session.update({
            sub: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        // Redirect to protected area
        throw redirect({ to: data.redirectTo });
    });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
    const session = await useAppSession();
    await session.clear();
    throw redirect({ to: "/" });
});

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
    async (): Promise<User | null> => {
        const session = await useAppSession();
        const userId = session.data.sub;

        if (!userId) {
            return null;
        }

        const db = await connectToDatabase();

        const user = await db
            .collection<UserDoc>("users")
            .findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return null;
        }

        const { _id, hash, salt, ...rest } = user;

        return { _id: _id.toString(), ...rest };
    },
);

export const updateUser = createServerFn({ method: "POST" })
    .inputValidator((data: { userId: string, shareBooks: boolean, shareMovies: boolean, password?: string }) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        const hashData = data.password ? hashPassword(data.password) : {};
        const update = {
            shareBooks: data.shareBooks,
            shareMovies: data.shareMovies,
            ...hashData,
        };

        db.collection<UserDoc>("users")
            .updateOne(
                { _id: new ObjectId(data.userId) },
                { $set: update },
            );

        throw redirect({ to: "/people" });
    });

export const getPeopleFn = createServerFn({ method: "GET" }).handler(async () => {
    const db = await connectToDatabase();

    const documents = await db
        .collection("users")
        .aggregate()
        .match({ $or: [{ shareBooks: true }, { shareMovies: true }] })
        .lookup({ from: "books", localField: "_id", foreignField: "userId", as: "books" })
        .lookup({ from: "movies", localField: "_id", foreignField: "userId", as: "movies" })
        .project<UserInfoDoc>({
            name: 1,
            shareBooks: 1,
            shareMovies: 1,
            books: { $size: "$books" },
            movies: { $size: "$movies" },
            total: { $add: [{ $size: "$books" }, { $size: "$movies" }] }
        })
        .match({ total: { $gt: 0 } })
        .sort({ total: -1, name: 1 })
        .toArray();

    const people = documents.map((doc) => ({ ...doc, _id: doc._id.toString() }));

    return people;
});

const checkPassword = (password: string, hash: string, salt: string) =>
    crypto.pbkdf2Sync(password, salt, 1000, 64, "sha1").toString("hex") === hash;

const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha1").toString("hex");
    return { salt, hash };
};