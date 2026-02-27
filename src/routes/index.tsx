import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  loader: () => ({ pageName: "Home" }),
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
    </div>
  );
}
