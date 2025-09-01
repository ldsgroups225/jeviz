import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/kit-content/home";

export const Route = createFileRoute("/_static/")({
  component: HomePage,
});
