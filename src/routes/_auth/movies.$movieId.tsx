import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/movies/$movieId')({
  loader: () => ({ pageName: "Update Movie" }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/movies/$movieId"!</div>
}
