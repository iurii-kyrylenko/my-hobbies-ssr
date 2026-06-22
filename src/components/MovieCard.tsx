import { MovieReview } from "~/server/movies";
import { MovieInfo } from "./MovieInfo";
import { MediaCardBase } from "./MediaCardBase";

export function MovieCard({ movie, userId, onDeleteMovie }: {
    movie: MovieReview;
    userId?: string;
    onDeleteMovie: () => void;
}) {
    return (
        <MediaCardBase
            userId={userId}
            ownerId={movie.userId}
            onDelete={onDeleteMovie}
            mediaId={movie._id}
            collection="movies"
            extrasCount={movie.extrasCount}
            header={
                <>
                    <div className="text-sm font-bold text-blue-500">{movie.title}</div>
                    <div className="text-sm opacity-70">Release date: {movie.year}</div>
                    <div className="text-sm italic">{movie.notes}</div>
                    <div className="text-sm opacity-70">Watched on: {movie.completed}</div>
                </>
            }
        >
            <MovieInfo {...movie} />
        </MediaCardBase>
    );
}
