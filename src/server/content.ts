import { createServerFn } from "@tanstack/react-start";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "~/lib/db";

interface Content {
    title: string;
    content: string;
}

interface GetExtras {
    collection: string;
    mediaId: string;
}

interface CreateContent {
    collection: string;
    userId: string;
    mediaId: string;
    title: string;
    content: string;
}

interface UpdateContent {
    collection: string;
    userId: string;
    mediaId: string;
    title: string;
    content: string;
    index: number;
}

interface RemoveContent {
    collection: string;
    userId: string;
    mediaId: string;
    index: number;
}


export const getExtras = createServerFn({ method: "GET" })
    .inputValidator((data: GetExtras) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        const document = await db.collection<{ extras?: Content[] }>(data.collection)
            .findOne(
                { _id: new ObjectId(data.mediaId) }
            )

        const extras = (document?.extras ?? []).map((e, id) => ({ ...e, id }));
        extras.sort((e1, e2) => e1.title.localeCompare(e2.title));
        return extras;
    });

export const createContent = createServerFn({ method: "POST" })
    .inputValidator((data: CreateContent) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection(data.collection)
            .updateOne(
                { _id: new ObjectId(data.mediaId), userId: new ObjectId(data.userId) },
                { $addToSet: { extras: { title: data.title, content: data.content } } }
            );
    });

export const updateContent = createServerFn({ method: "POST" })
    .inputValidator((data: UpdateContent) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection(data.collection)
            .updateOne(
                { _id: new ObjectId(data.mediaId), userId: new ObjectId(data.userId) },
                { $set: { [`extras.${data.index}`]: { title: data.title, content: data.content } } }
            );
    });

export const removeContent = createServerFn({ method: "POST" })
    .inputValidator((data: RemoveContent) => data)
    .handler(async ({ data }) => {
        const db = await connectToDatabase();

        await db.collection(data.collection)
            .updateOne(
                { _id: new ObjectId(data.mediaId), userId: new ObjectId(data.userId) },
                [
                    {
                        $set: {
                            extras: {
                                $cond: {
                                    // 1. Check if the final filtered array size will be 0
                                    // (This happens if the current size is 1 and we are removing
                                    // index 0, or if it's already empty)
                                    if: {
                                        $or: [
                                            { $eq: [{ $size: "$extras" }, 0] },
                                            {
                                                $and: [
                                                    { $eq: [{ $size: "$extras" }, 1] },
                                                    { $eq: [data.index, 0] }
                                                ]
                                            }
                                        ]
                                    },
                                    // 2. Drop the field entirely if it's going to be empty
                                    then: "$$REMOVE",
                                    // 3. Otherwise, map the remaining elements
                                    else: {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: { $range: [0, { $size: "$extras" }] },
                                                    as: "idx",
                                                    cond: { $ne: ["$$idx", data.index] }
                                                }
                                            },
                                            as: "idx",
                                            in: { $arrayElemAt: ["$extras", "$$idx"] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            );
    });
