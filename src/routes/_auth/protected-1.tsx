import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/protected-1")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();

    return (
        <div className="p-2">
            <h1>Protected 1</h1>
            Welcome, {user.email}!
        </div>
    );
}
