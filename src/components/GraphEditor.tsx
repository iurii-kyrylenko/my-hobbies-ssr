import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import EditorComponent from "react-simple-code-editor";
import prism from 'prismjs';
import "prismjs/components/prism-dot"; // Import DOT language support
import "prismjs/themes/prism-tomorrow.css"; // Import a dark theme for Prism

const Editor = (EditorComponent as any).default || EditorComponent;

export function GraphEditor({ isOpen, onClose, onChange, code }: {
    isOpen: boolean,
    onClose: () => void,
    onChange: (code: string) => void,
    code: string,
}) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                {/* Overlay */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        {/* Dialog Content */}
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300"
                                >
                                    Dot code
                                </DialogTitle>
                                <div className="mt-2">
                                    <Editor
                                        autoFocus
                                        value={code}
                                        onValueChange={onChange}
                                        highlight={(code: string) => prism.highlight(code, prism.languages.dot, "dot")}
                                        padding={10}
                                        className="font-mono text-xs border border-[#aaa]"
                                    />
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-400 px-4 py-2 text-sm font-medium text-gray-700 dark:text-black hover:bg-gray-300"
                                        onClick={onClose}
                                    >
                                        OK
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
