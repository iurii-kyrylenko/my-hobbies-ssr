import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/protected")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();

    return (
        <div className="p-2">
            Welcome, {user.email}!
        </div>
    );
}
