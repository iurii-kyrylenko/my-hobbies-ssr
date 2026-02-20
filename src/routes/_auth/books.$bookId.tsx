import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/books/$bookId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/books/$bookId"!</div>
}
