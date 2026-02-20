import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/books/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/books/new"!</div>
}
