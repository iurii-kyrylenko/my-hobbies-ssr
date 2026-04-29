import { useState, useEffect, ReactNode } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { UseQueryResult } from "@tanstack/react-query";
import { Severity, useNotification } from "./notifications";

interface MediaInfoBaseProps<T> {
    query: UseQueryResult<T, Error>;
    imageUrl?: string;
    imageAlt: string;
    contentHtml?: string;
}

export function MediaInfoBase<T>({
    query,
    imageUrl,
    imageAlt,
    contentHtml
}: MediaInfoBaseProps<T>) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const notify = useNotification();

    const { data, isError, error, isLoading } = query;

    // Logic: Ready when data exists AND image is loaded (or no image exists)
    const hasImage = !!imageUrl;
    const isActuallyReady = !isLoading && !!data && (hasImage ? imageLoaded : true);

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
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="rounded shadow-sm"
                            onLoad={() => setImageLoaded(true)}
                        />
                    )}
                    <div
                        className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: contentHtml ?? "" }}
                    />
                </div>
            </Transition>

            {/* Hidden Preloader */}
            {imageUrl && !imageLoaded && (
                <img
                    src={imageUrl}
                    className="hidden"
                    aria-hidden="true"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                />
            )}
        </div>
    );
}
