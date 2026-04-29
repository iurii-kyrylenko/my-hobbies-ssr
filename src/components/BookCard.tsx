import { BookReview } from "~/server/books";
import { BookInfo } from "./BookInfo";
import { MediaCardBase } from "./MediaCardBase";

export function BookCard({ book, userId, onDeleteBook }: {
    book: BookReview;
    userId?: string;
    onDeleteBook: () => void;
}) {
    return (
        <MediaCardBase
            userId={userId}
            ownerId={book.userId}
            onDelete={onDeleteBook}
            editLink={{ to: "/books/$bookId", params: { bookId: book._id } }}
            storyline={book.hasStoryline ? { type: "book", id: book._id } : undefined}
            header={
                <>
                    <div className="text-sm font-bold">{book.title}</div>
                    <div className="text-sm font-medium text-blue-500">by {book.author}</div>
                    <div className="text-sm">
                        {book.mode === "r" ? "REGULAR" : book.mode === "a" ? "AUDIO" : "MIXED"}
                        {" | "}
                        Read on {book.completed}
                    </div>
                </>
            }
        >
            <BookInfo {...book} />
        </MediaCardBase>
    );
}
