import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/extras/$collection/$id")({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/_auth/extras/$collection/$id"!</div>
}
