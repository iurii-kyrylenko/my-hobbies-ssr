import { useState, useEffect } from "react";
import { getMovieInfo } from "~/server/movieInfo";
import { useQuery } from "@tanstack/react-query";
import { Severity, useNotification } from "./notifications";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

export function MovieInfo({ imdbId }: { imdbId: string }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["movieInfo", imdbId],
        queryFn: () => getMovieInfo({ data: { imdbId } }),
        staleTime: Infinity,
        retry: false,
    });

    const notify = useNotification();

    // Logic: Ready when data exists AND image is loaded (or no image exists)
    const hasThumbnail = !!data?.poster;
    const isActuallyReady = !isLoading && !!data && (hasThumbnail ? imageLoaded : true);

    // Delay spinner appearance to avoid flickering on fast connections
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isActuallyReady) {
            timer = setTimeout(() => setShowSpinner(true), 200);
        } else {
            setShowSpinner(false);
        }
        return () => clearTimeout(timer);
    }, [isActuallyReady]);

    if (isError) {
        notify({ message: error.message, severity: Severity.ERR });
    }

    return (
        <div className="relative min-h-[100px] w-full">
            {/* Loading Spinner */}
            <Transition
                show={showSpinner && !isActuallyReady}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <ArrowPathIcon className="size-5 animate-spin text-gray-400" />
                </div>
            </Transition>

            {/* Content Transition */}
            <Transition
                show={isActuallyReady}
                enter="transition-all duration-500 ease-out"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
            >
                <div className="flex flex-col items-start">
                    {data?.poster && (
                        <img
                            src={data.poster}
                            alt={imdbId}
                            className="rounded shadow-sm"
                            onLoad={() => setImageLoaded(true)}
                        />
                    )}
                    <div
                        className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: data?.plot ?? "" }}
                    />
                </div>
            </Transition>

            {/* Hidden Preloader: 
                Crucial for Option 2 logic. It triggers the onLoad event 
                even while the main Transition is unmounted/hidden.
            */}
            {data?.poster && !imageLoaded && (
                <img
                    src={data.poster}
                    className="hidden"
                    aria-hidden="true"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)} // Don't get stuck if image 404s
                />
            )}
        </div>
    );
}
