import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_static/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_static/"!</div>;
}
