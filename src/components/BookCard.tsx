import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Book } from "~/server/books";
import { BookInfo } from "./BookInfo";
import { Link } from "@tanstack/react-router";

export function BookCard({ book, userId, onDeleteBook }: {
    book: Book,
    userId?: string,
    onDeleteBook: () => void,
}) {
    return (
        <div className="p-2 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50">
            <div className="m-2 flex flex-col gap-1 opacity-85">
                <div className="text-sm font-bold">{book.title}</div>
                <div className="text-sm font-medium text-blue-500">by {book.author}</div>
                <div className="text-sm">
                    {book.mode === "r" ? "REGULAR" : book.mode === "a" ? "AUDIO" : "MIXED"}
                    {" | "}
                    Read on {book.completed}
                </div>
            </div>

            <Disclosure as="div" className="border rounded-md p-2">
                <DisclosureButton className="group flex w-full items-center justify-between hover:cursor-pointer">
                    <span className="text-sm">
                        Details...
                    </span>
                    <ChevronDownIcon className="size-5 text-blue-400 group-data-open:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                    <BookInfo {...book} />
                </DisclosurePanel>
            </Disclosure>

            {userId === book.userId &&
                <div className="m-2 mt-4 flex gap-6">
                    <Link className="hover:underline" to="/books/$bookId" params={{ bookId: book._id }}>
                        <PencilIcon className="size-5 text-blue-400" />
                    </Link>
                    <button
                        className="cursor-pointer hover:underline"
                        onClick={onDeleteBook}
                    >
                        <TrashIcon className="size-5 text-blue-400" />
                    </button>
                </div>}
        </div>
    );
}