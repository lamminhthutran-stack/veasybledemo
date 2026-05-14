import { Outlet, createFileRoute } from "@tanstack/react-router";
import { OpsLayout } from "@/components/OpsLayout";

export const Route = createFileRoute("/ops")({
  component: OpsLayoutRoute,
});

function OpsLayoutRoute() {
  return (
    <OpsLayout>
      <Outlet />
    </OpsLayout>
  );
}
