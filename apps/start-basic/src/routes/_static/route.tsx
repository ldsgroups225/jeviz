import { Navbar } from "@/components/common/navbar";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_static")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <Outlet />
    </div>
  );
}
