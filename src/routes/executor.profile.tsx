import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/executor/profile")({
  component: () => <Outlet />,
});
