import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, PencilIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MovieReview } from "~/server/movies";
import { MovieInfo } from "./MovieInfo";
import { Link } from "@tanstack/react-router";

export function MovieCard({ movie, userId, onDeleteMovie }: {
    movie: MovieReview,
    userId?: string,
    onDeleteMovie: () => void,
}) {
    return (
        <div className="p-2 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50">
            <div className="m-2 flex flex-col gap-1 opacity-85">
                <div className="text-sm font-bold text-blue-500">{movie.title}</div>
                <div className="text-sm opacity-70">Release date: {movie.year}</div>
                <div className="text-sm italic">{movie.notes}</div>
                <div className="text-sm opacity-70">Watched on: {movie.completed}</div>
            </div>

            <Disclosure as="div" className="border rounded-md p-2">
                <DisclosureButton className="group flex w-full items-center justify-between hover:cursor-pointer">
                    <span className="text-sm">
                        Details...
                    </span>
                    <ChevronDownIcon className="size-5 text-blue-400 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                    <MovieInfo {...movie} />
                </DisclosurePanel>
            </Disclosure>

            <div className="m-2 mt-4 flex gap-6">
                {userId === movie.userId &&
                    <>
                        <Link to="/movies/$movieId" params={{ movieId: movie._id }}>
                            <PencilIcon className="size-5 text-blue-400" />
                        </Link>
                        <button
                            className="cursor-pointer"
                            onClick={onDeleteMovie}
                        >
                            <TrashIcon className="size-5 text-blue-400" />
                        </button>
                    </>}
                {movie.hasStoryline && <Link
                    className={userId === movie.userId ? "ml-auto" : ""}
                    to="/graph/$type/$id"
                    params={{ type: "movie", id: movie._id }}
                >
                    <RectangleGroupIcon className="size-5 text-blue-400" />
                </Link>}
            </div>

        </div>
    );
}
