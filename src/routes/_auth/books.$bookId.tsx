import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/books/$bookId")({
    component: RouteComponent,
});

function RouteComponent() {
    const handleUpdate = () => {};

    return (
        <div>
            <button onClick={handleUpdate}>
                Update
            </button>
        </div>
    );
}
