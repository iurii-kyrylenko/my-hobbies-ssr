import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Link, useLocation, useRouteContext, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { logoutFn } from "~/server/users";

export function Drawer(
    { isOpen, onClose, children }: {
        isOpen: boolean,
        onClose: () => void,
        children: ReactNode,
    }
) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    as={Fragment}
                    enter="transition-opacity ease-in duration-400"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-out duration-400"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                </TransitionChild>
                <TransitionChild
                    as={Fragment}
                    enter="transition ease-in-out duration-400 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-400 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className="fixed inset-0">
                        <DialogPanel className="w-2/3 sm:w-1/2 h-screen bg-white dark:bg-black p-4">
                            {children}
                        </DialogPanel>
                    </div>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

export function MyDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const logoutServerFn = useServerFn(logoutFn);
    const { user } = useRouteContext({ strict: false });
    const { pathname } = useLocation();

    const handleClose = () => setIsOpen(false);

    const handleLogout = async () => {
        await logoutServerFn();
        await router.invalidate();
    };

    useEffect(() => {
        handleClose();
        console.log({ isOpen });
    }, [pathname]);

    return (
        <>
            <button onClick={() => setIsOpen(true)}>
                &nbsp;☰&nbsp;
            </button>

            <Drawer isOpen={isOpen} onClose={handleClose}>
                <h1 className="text-xl">My Hobbies</h1>

                <div className="mt-4 flex flex-col gap-2">
                    <Link to="/" activeProps={{ className: "font-bold disabled" }} activeOptions={{ exact: true }}>
                        Home
                    </Link>
                    <Link to="/people" activeProps={{ className: "font-bold  disabled" }} activeOptions={{ exact: true }}>
                        People
                    </Link>
                    {user && (
                        <>
                            <Link to="/$userId/books" params={{ userId: user._id }} activeProps={{ className: "font-bold disabled" }}>
                                Books
                            </Link>
                            <Link to="/$userId/movies" params={{ userId: user._id }} activeProps={{ className: "font-bold disabled" }}>
                                Movies
                            </Link>
                            <Link to="/profile" activeProps={{ className: "font-bold disabled" }}>
                                Profile
                            </Link>
                            <Link to="/" onClick={handleLogout}>
                                Logout
                            </Link>
                        </>
                    )}
                    {!user && (
                        <Link to="/login" activeProps={{ className: "font-bold" }}>
                            Login
                        </Link>
                    )}
                </div>
            </Drawer>
        </>
    );
}