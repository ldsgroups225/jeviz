import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/app/user")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p>hi</p>
      <Link to="/app">app</Link>;
    </div>
  );
}
