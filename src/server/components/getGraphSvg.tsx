import { Graphviz } from "@hpcc-js/wasm-graphviz";
import { createServerFn } from "@tanstack/react-start";
import { createCompositeComponent } from "@tanstack/react-start/rsc";
import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import z from "zod";
import { connectToDatabase } from "~/lib/db";

function Svg({ ssvg }: { ssvg: string }) {
    return (
        <div
            id="graph-container"
            className="w-full h-[86vh] flex items-center justify-center p-2
                    [&>svg]:w-full [&>svg]:h-full [&>svg]:block
                    [&_.node]:cursor-pointer [&_.node]:transition-opacity [&_.node]:hover:opacity-80"
            dangerouslySetInnerHTML={{ __html: ssvg ?? "" }}
        />
    );
}

const cleanSvg = (svgString: string) => {
    return svgString
        .replace(/width="[\d\.]+(pt|px)"/g, "")
        .replace(/height="[\d\.]+(pt|px)"/g, "");
};

interface CompositeLayoutProps {
    copyButton: (data: { dotString: string }) => ReactNode;
}

export const getGraphSvg = createServerFn()
    .inputValidator(z.object({ type: z.string(), id: z.string() }))
    .handler(async ({ data: { type, id } }) => {
        const collection = type === "book" ? "books" : "movies";
        const db = await connectToDatabase();

        const document = await db.collection<{ storyline: string }>(collection)
            .findOne({ _id: new ObjectId(id) });

        if (!document) {
            throw new Error(`${type} '${id}' not found`);
        }

        const dotString = document.storyline;

        if (!dotString) {
            throw new Error(`Storyline not defined for book '${id}'`);
        }

        const svgString = await Graphviz.load().then(graphviz => graphviz.dot(dotString));
        const content = cleanSvg(svgString);

        return createCompositeComponent(
            (props: CompositeLayoutProps) =>
                <div className="relative group">
                    <div className="absolute right-24 bottom-8">
                        {props.copyButton({ dotString })}
                    </div>
                    <Svg ssvg={content} />
                </div>
        );
    });
