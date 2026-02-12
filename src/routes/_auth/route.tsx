import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "~/server/users";

export const Route = createFileRoute("/_auth")({
    beforeLoad: async ({ location }) => {
        const user = await getCurrentUserFn();

        if (!user) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
            });
        }

        // Pass user to child routes
        return { user };
    },

    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Outlet />
    );
}
