import { createServerFn } from "@tanstack/react-start";
import { Graphviz } from "@hpcc-js/wasm-graphviz";
import { connectToDatabase } from "~/lib/db";
import { ObjectId } from "mongodb";

const cleanSvg = (svgString: string) => {
    return svgString
        .replace(/width="[\d\.]+(pt|px)"/g, "")
        .replace(/height="[\d\.]+(pt|px)"/g, "");
};

export const getGraphSvg = createServerFn({ method: "GET" })
    .inputValidator((d: { type: string, id: string }) => d)
    .handler(async ({ data: { type, id } }): Promise<string> => {
        const collection = type == "book" ? "books" : "movies";
        const db = await connectToDatabase();

        const document = await db.collection<{ storyline: string }>(collection)
            .findOne({ _id: new ObjectId(id) });

        if (!document) {
            throw new Error(`Book '${id}' not found`);
        }

        const dotString = document.storyline;

        if (!dotString) {
            throw new Error(`Storyline not defined for book '${id}'`);
        }

        const svg = await Graphviz.load().then(graphviz => graphviz.dot(dotString));
        return cleanSvg(svg);
    });
