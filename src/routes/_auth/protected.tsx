import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/protected")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = Route.useRouteContext();

    return (
        <div className="p-2">
            <h1>Protected</h1>
            Welcome, {user.email}!
        </div>
    );
}
