import { RectangleGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";

export function LinkToExtra(
    {
        collection,
        mediaId,
        isOwner,
        extrasCount,
    }:
        {
            collection: "books" | "movies",
            mediaId: string,
            isOwner: boolean,
            extrasCount: number,
        },
) {
    if (!isOwner && extrasCount === 0) {
        return null;
    }

    const linkProps = isOwner
        ? { to: "/extras/$collection/$id", params: { collection, id: mediaId } }
        : extrasCount === 1
            ? { to: "/content/$collection/$id/$index", params: { collection, id: mediaId, index: 0 } }
            : { to: "/extras-pub/$collection/$id", params: { collection, id: mediaId } }

    const isCountVisible = isOwner && extrasCount > 0 || !isOwner && extrasCount > 1;

    return (
        <Link
            className="flex items-baseline gap-1"
            {...linkProps}
        >
            <RectangleGroupIcon className="size-5 text-blue-400" />
            {isCountVisible && <div className="text-xs">
                {extrasCount}
            </div>}
        </Link>
    );
}
