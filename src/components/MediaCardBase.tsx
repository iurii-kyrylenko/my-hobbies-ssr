import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, PencilIcon, TrashIcon, SparklesIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

interface MediaCardBaseProps {
    userId?: string;
    ownerId: string;
    onDelete: () => void;
    mediaId: string;
    collection: "books" | "movies";
    storyline?: { type: "book" | "movie"; id: string };
    header: ReactNode;
    children: ReactNode; // The Info component (BookInfo or MovieInfo)
}

export function MediaCardBase({
    userId,
    ownerId,
    onDelete,
    mediaId,
    collection,
    storyline,
    header,
    children,
}: MediaCardBaseProps) {
    const isOwner = userId === ownerId;

    const editLink = {
        to: `/${collection}/$id`,
        params: { id: mediaId },
    };

    const extrasLink = {
        to: "/extras/$collection/$id",
        params: { collection, id: mediaId },
    };

    return (
        <div className="p-2 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50">
            {/* Header Section */}
            <div className="m-2 flex flex-col gap-1 opacity-85">
                {header}
            </div>

            {/* Collapsible Details */}
            <Disclosure as="div" className="border rounded-md p-2">
                <DisclosureButton className="group flex w-full items-center justify-between hover:cursor-pointer">
                    <span className="text-sm">Details...</span>
                    <ChevronDownIcon className="size-5 text-blue-400 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                    {children}
                </DisclosurePanel>
            </Disclosure>

            {/* Action Buttons */}
            <div className="m-2 mt-4 flex gap-6">
                {isOwner && (
                    <>
                        <Link to={editLink.to} params={editLink.params}>
                            <PencilIcon className="size-5 text-blue-400" />
                        </Link>
                        <button className="cursor-pointer" onClick={onDelete}>
                            <TrashIcon className="size-5 text-blue-400" />
                        </button>
                        <Link to={extrasLink.to} params={extrasLink.params}>
                            <RectangleGroupIcon className="size-5 text-blue-400" />
                        </Link>
                    </>
                )}
                {storyline && (
                    <Link
                        className={isOwner ? "ml-auto" : ""}
                        to="/graph/$type/$id"
                        params={{ type: storyline.type, id: storyline.id }}
                    >
                        <SparklesIcon className="size-5 text-blue-400" />
                    </Link>
                )}
            </div>
        </div>
    );
}
