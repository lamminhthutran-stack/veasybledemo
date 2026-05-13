import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/executor/task/$id")({
  component: () => <Outlet />,
});
