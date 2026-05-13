import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/ops/executors")({
  component: () => <Outlet />,
});
