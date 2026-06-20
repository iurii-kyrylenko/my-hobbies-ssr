import { PencilIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import { ContentEditor } from "~/components/ContentEditor";
import { Severity, useNotification } from "~/components/notifications";
import { createContent, getExtras, removeContent, updateContent } from "~/server/content";

export const extrasQueryOptions = (collection: string, mediaId: string) =>
    queryOptions({
        queryKey: [collection, mediaId],
        queryFn: () => getExtras({ data: { mediaId, collection } }),
        staleTime: Infinity,
        retry: false,
    });

export const Route = createFileRoute("/_auth/extras/$collection/$id")({
    parseParams: (rawParams) => ({
        id: z.string().parse(rawParams.id),
        collection: z.enum(["books", "movies"]).parse(rawParams.collection),
    }),
    loader: async ({ params, context: { queryClient } }) => {
        await queryClient.ensureQueryData(extrasQueryOptions(params.collection, params.id));
        return { pageName: "Extra content" };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { user } = Route.useRouteContext();
    const params = Route.useParams();
    const notify = useNotification();
    const queryClient = useQueryClient();

    const [isContentEditorOpen, setContentEditorOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");

    const [itemToDelete, setItemToDelete] = useState<{ id: number, title: string } | null>(null);
    const [itemToUpdate, setItemToUpdate] = useState<number | null>(null);

    const startAddContent = () => {
        setContentEditorOpen(true);
        setTitle("");
        setCode("");
    };

    const startUpdateContent = ({ id, title, content }: { id: number, title: string, content: string }) => () => {
        setItemToUpdate(id);
        setTitle(title);
        setCode(content);
    };

    const startRemoveContent = ({ id, title }: { id: number, title: string }) => () => {
        setItemToDelete({ id, title });
    };

    const handleCloseEdit = () => {
        setContentEditorOpen(false);
        setItemToUpdate(null);
    };

    const handleSubmitContent = () => {
        if (itemToUpdate === null) {
            createContentMutation.mutate({
                data: {
                    userId: user._id,
                    mediaId: params.id,
                    collection: params.collection,
                    title,
                    content: code,
                },
            });
            setContentEditorOpen(false);
        } else {
            updateContentMutation.mutate({
                data: {
                    userId: user._id,
                    mediaId: params.id,
                    collection: params.collection,
                    index: itemToUpdate,
                    title,
                    content: code,
                },
            });
        }
    };

    const hanleRemoveContent = (indexToDelete: number) => {
        removeContentMutation.mutate({
            data: {
                userId: user._id,
                mediaId: params.id,
                collection: params.collection,
                index: indexToDelete,
            },
        });
    }

    const handleEditTitleChange = (title: string) => {
        setTitle(title);
    };

    const handleEditContentChange = (code: string) => {
        setCode(code);
    };

    const createContentMutation = useMutation({
        mutationFn: createContent,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [params.collection, params.id] });
            notify({ message: "A content was added", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const updateContentMutation = useMutation({
        mutationFn: updateContent,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [params.collection, params.id] });
            await queryClient.invalidateQueries({ queryKey: ["content", params.collection, params.id, itemToUpdate] });
            setItemToUpdate(null);
            notify({ message: "A content was updated", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const removeContentMutation = useMutation({
        mutationFn: removeContent,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [params.collection, params.id] });
            notify({ message: "A content was removed", severity: Severity.MSG });
        },
        onError: (error) => {
            notify({ message: error.message, severity: Severity.ERR });
        },
    });

    const { data } = useSuspenseQuery(extrasQueryOptions(params.collection, params.id));

    return (
        <>
            <button
                className="fixed z-10 top-20 right-6 size-12 text-2xl rounded-full border-2 border-blue-400 flex items-center justify-center opacity-60"
                onClick={startAddContent}
            >
                +
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-4 gap-4 items-start">
                {data.map((extra) => (
                    <div
                        className="p-3 shadow-sm bg-white dark:bg-black dark:shadow-gray-500/50 flex flex-col gap-4"
                        key={extra.id}
                    >
                        <span className="text-xl">{extra.title}</span>
                        <div className="ms-2 flex gap-4">
                            <button
                                className="cursor-pointer"
                                onClick={startUpdateContent(extra)}
                            >
                                <PencilIcon className="size-5 text-blue-400" />
                            </button>
                            <button
                                className="cursor-pointer"
                                onClick={startRemoveContent(extra)}
                            >
                                <TrashIcon className="size-5 text-blue-400" />
                            </button>
                            <Link
                                className="ml-auto cursor-pointer"
                                to="/content/$collection/$id/$index"
                                params={{ ...params, index: extra.id }}
                            >
                                <SparklesIcon className="size-5 text-blue-400" />
                            </Link>
                        </div>
                    </div>)
                )}
            </div>

            <ConfirmationDialog
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) hanleRemoveContent(itemToDelete.id);
                    setItemToDelete(null);
                }}
                message={`Do you want to delete content "${itemToDelete?.title}"?`}
            />

            <ContentEditor
                isOpen={isContentEditorOpen || itemToUpdate !== null}
                title={title}
                code={code}
                onClose={handleCloseEdit}
                onSubmit={handleSubmitContent}
                onTitleChange={handleEditTitleChange}
                onCodeChange={handleEditContentChange}
            />
        </>
    );
}
