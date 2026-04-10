import { RectangleGroupIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { GraphEditor } from "./GraphEditor";

export type MovieFormData = {
    title: string,
    notes: string,
    year: string,
    imdbId: string,
    completed: string,
    storyline: string,
};

export type FormDataChangeEvent = {
    target: {
        name: string,
        value: string,
    },
};

export function MovieForm(
    { data, onChange, onSubmit }:
        {
            data: MovieFormData,
            onChange: (e: FormDataChangeEvent) => void,
            onSubmit: () => void,
        }
) {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    const [isGraphEditorOpen, setIsGraphEditorOpen] = useState(false);

    return (
        <>
            <div className="grid place-items-center">
                <form className="mt-4 max-w-lg" onSubmit={handleSubmit}>
                    <fieldset className="w-full grid gap-6">
                        <div className="grid gap-2 items-center min-w-[300px]">
                            <label htmlFor="title" className="text-sm font-medium">
                                Movie title
                            </label>
                            <input
                                id="title"
                                name="title"
                                placeholder="Enter movie title"
                                type="text"
                                className="border rounded-md p-2 w-full"
                                required
                                value={data.title}
                                onChange={onChange}
                            />
                        </div>
                        <div className="grid gap-2 items-center min-w-[300px]">
                            <label htmlFor="year" className="text-sm font-medium">
                                Year
                            </label>
                            <input
                                id="year"
                                name="year"
                                placeholder="Enter release yearr"
                                type="text"
                                className="border rounded-md p-2 w-full"
                                required
                                value={data.year}
                                onChange={onChange}
                            />
                        </div>
                        <div className="grid gap-2 items-center min-w-[300px]">
                            <label htmlFor="notes" className="text-sm font-medium">
                                Notes
                            </label>
                            <input
                                id="notes"
                                name="notes"
                                placeholder="Notes on movie"
                                type="text"
                                className="border rounded-md p-2 w-full"
                                required
                                value={data.notes}
                                onChange={onChange}
                            />
                        </div>
                        <div className="grid gap-2 items-center min-w-[300px]">
                            <label htmlFor="imdbId" className="text-sm font-medium">
                                IMDB ID
                            </label>
                            <input
                                id="imdbId"
                                name="imdbId"
                                placeholder="Enter IMDB ID"
                                type="text"
                                className="border rounded-md p-2 w-full"
                                value={data.imdbId}
                                onChange={onChange}
                            />
                        </div>
                        <div className="grid gap-2 items-center min-w-[300px]">
                            <label htmlFor="completed" className="text-sm font-medium">
                                Completed
                            </label>
                            <input
                                id="completed"
                                name="completed"
                                placeholder="yyyy-mm-dd"
                                type="text"
                                className="border rounded-md p-2 w-full"
                                required
                                value={data.completed}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <button
                                className="min-w-[300px] flex justify-between cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsGraphEditorOpen(true);
                                }}
                            >
                                <div>Storyline</div>
                                <RectangleGroupIcon className="size-6 text-blue-400" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white mt-4 py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
                        >
                            Save movie
                        </button>
                    </fieldset>
                </form>
            </div>

            <GraphEditor
                isOpen={isGraphEditorOpen}
                onClose={() => setIsGraphEditorOpen(false)}
                code={data.storyline}
                onChange={(code) => onChange({
                    target: {
                        name: "storyline",
                        value: code,
                    }
                })}
            />
        </>
    );
}
