import { createServerFn } from "@tanstack/react-start";

type GoogleSearchResponse = any;

interface BookSearchInput {
    author: string;
    title: string;
    googleBookId: string;
}

interface BookSearchResult {
    description: string;
    thumbnail: string;
}


const buildQuery = (author: string, title: string) => {
    const inauthor = author;
    const intitle = title.replace(/\s*(:|\().+$/, "");
    return `inauthor:${inauthor}+intitle:${intitle}`;
};

const parseGoogleResponse = (res: GoogleSearchResponse): BookSearchResult => {
    let thumbnail = "",
        description = "";
    const totalItems = res?.totalItems ?? 0;

    for (let i = 0; i < totalItems; i++) {
        const volumnInfo = res?.items?.[i]?.volumeInfo;
        thumbnail = volumnInfo?.imageLinks?.thumbnail ?? "";
        description = volumnInfo?.description ?? "";
        if (thumbnail && description) break;
    }

    return { thumbnail, description };
};

export const getBookInfo = createServerFn({ method: 'GET' })
    .inputValidator((d: BookSearchInput) => d)
    .handler(async ({ data }): Promise<BookSearchResult> => {
        const baseURL = process.env.GOOGLE_BOOKS_API;

        if (data.googleBookId) {
            const res = await fetch(`${baseURL}volumes/${data.googleBookId}`);

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const result: GoogleSearchResponse = await res.json();

            return {
                thumbnail: result?.volumeInfo?.imageLinks?.thumbnail ?? "",
                description: result?.volumeInfo?.description ?? "",
            };
        }

        const url = new URL(`${baseURL}volumes`);
        url.search = new URLSearchParams({ q: buildQuery(data.author, data.title) }).toString();
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        const result: GoogleSearchResponse = await res.json();
        return parseGoogleResponse(result);
    });
