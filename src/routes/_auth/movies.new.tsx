import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/movies/new')({
  loader: () => ({ pageName: "Add Movie" }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/movies/new"!</div>
}
