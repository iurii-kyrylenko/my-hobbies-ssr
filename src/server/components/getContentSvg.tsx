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
            className="w-full h-[85vh] flex items-center justify-center p-2
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
    copyButton: (data: { inputString: string }) => ReactNode;
}

const handleMmd = async (mmdString: string) => {
    const base64 = Buffer.from(mmdString, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const endpointUrl = `https://mermaid.ink/svg/${base64}`;

    const response = await fetch(endpointUrl);

    if (!response.ok) {
        throw new Error(`Fetch mermaid svg error: ${await response.text()}`);
    }

    return response.text();
};

export const getContentSvg = createServerFn()
    .inputValidator(z.object({ collection: z.enum(["books", "movies"]), id: z.string(), index: z.uint32() }))
    .handler(async ({ data: { collection, id, index } }) => {
        const db = await connectToDatabase();

        const document = await db.collection(collection)
            .aggregate<{ extra: { title: string, content: string } }>([
                { $match: { _id: new ObjectId(id) } },
                { $limit: 1 },
                {
                    $project: {
                        extra: { $arrayElemAt: ["$extras", index] }
                    }
                },
            ])
            .next();

        if (!document) {
            throw new Error("Content not found");
        }

        const inputString = document.extra.content;

        if (!inputString) {
            throw new Error("Content not defined");
        }

        const svgString = inputString.startsWith("%% mmd")
            ? await handleMmd(inputString)
            : await Graphviz.load().then(graphviz => graphviz.dot(inputString));

        const content = cleanSvg(svgString);

        return createCompositeComponent(
            (props: CompositeLayoutProps) =>
                <div className="flex flex-col">
                    <div className="dark:invert px-4 text-xs">
                        {document.extra.title}
                    </div>
                    <div className="relative group">
                        <div className="absolute right-24 bottom-8">
                            {props.copyButton({ inputString })}
                        </div>
                        <Svg ssvg={content} />
                    </div>
                </div>
        );
    });
