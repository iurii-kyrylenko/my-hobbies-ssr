import { ChevronUpIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/outline";

export function PageUp({
    isDisabled,
    onUp,
    onTop
}: {
    isDisabled: boolean,
    onUp: () => void,
    onTop: () => void,
}) {
    return (
        <div className="flex gap-8 pt-2 pl-8 opacity-60">
            <button
                className="size-12 rounded-full border-2 border-blue-400 flex items-center justify-center hover:cursor-pointer"
                onClick={onTop}
                disabled={isDisabled}
            >
                <ChevronDoubleUpIcon className="size-5 stroke-[2]" />
            </button>
            <button
                className="size-12 rounded-full border-2 border-blue-400 flex items-center justify-center hover:cursor-pointer"
                onClick={onUp}
                disabled={isDisabled}
            >
                <ChevronUpIcon className="size-5 stroke-[2]" />
            </button>
        </div>
    );
}
