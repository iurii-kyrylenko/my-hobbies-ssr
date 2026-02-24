export type BookFormData = {
    author: string,
    title: string,
    googleBookId: string,
    mode: string,
    completed: string,
};

export type FormDataChangeEvent = {
    target: {
        name: string,
        value: string,
    },
};

export function BookForm(
    { data, onChange, onSubmit }:
        {
            data: BookFormData,
            onChange: (e: FormDataChangeEvent) => void,
            onSubmit: () => void,
        }
) {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="grid place-items-center">
            <h3 className="text-xl">Update book</h3>
            <form className="mt-4 max-w-lg" onSubmit={handleSubmit}>
                <fieldset className="w-full grid gap-2">
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="title" className="text-sm font-medium">
                            Author
                        </label>
                        <input
                            id="author"
                            name="author"
                            placeholder="Enter book author"
                            type="text"
                            className="border rounded-md p-2 w-full"
                            required
                            value={data.author}
                            onChange={onChange}
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="title" className="text-sm font-medium">
                            Book title
                        </label>
                        <input
                            id="title"
                            name="title"
                            placeholder="Enter book title"
                            type="text"
                            className="border rounded-md p-2 w-full"
                            required
                            value={data.title}
                            onChange={onChange}
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="googleBookId" className="text-sm font-medium">
                            Google book Id
                        </label>
                        <input
                            id="googleBookId"
                            name="googleBookId"
                            placeholder="Enter Google book Id"
                            type="text"
                            className="border rounded-md p-2 w-full"
                            value={data.googleBookId}
                            onChange={onChange}
                        />
                    </div>
                    <div className="grid gap-2 items-center min-w-[300px]">
                        <label htmlFor="mode" className="text-sm font-medium">
                            Mode
                        </label>
                        <select
                            id="mode"
                            name="mode"
                            className="border rounded-md p-2 w-full"
                            value={data.mode}
                            onChange={onChange}
                        >
                            <option value="r">Regular</option>
                            <option value="a">Audio</option>
                            <option value="r-a">Mixed</option>
                        </select>
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white mt-4 py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        Save book
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
