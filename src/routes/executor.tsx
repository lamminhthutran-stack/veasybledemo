import { createFileRoute, Outlet, Link, useLocation, redirect } from "@tanstack/react-router";
import { isAcademyComplete } from "@/lib/academy-data";
import { AppLayout } from "@/components/AppLayout";
export const Route = createFileRoute("/executor")({
  beforeLoad: ({ location }) => {
    const requiresAcademy =
      location.pathname === "/executor/home" ||
      location.pathname === "/executor/browse" ||
      location.pathname === "/executor/tasks" ||
      location.pathname.startsWith("/executor/task");

    if (requiresAcademy && !isAcademyComplete()) {
      throw redirect({ to: "/executor/academy" });
    }
  },
  component: ExecutorLayout,
});

function ExecutorLayout() {
  const loc = useLocation();
  const onTask = loc.pathname.startsWith("/executor/task") && loc.pathname !== "/executor/tasks";
  const onSetup = loc.pathname.startsWith("/executor/profile/setup");
  const onAcademy = loc.pathname.startsWith("/executor/academy");
  const isAcademyOnboarding = onAcademy && !isAcademyComplete();
  const hideChrome = onTask || onSetup || isAcademyOnboarding;

  return (
    <AppLayout hideChrome={hideChrome}>
      <Outlet />
    </AppLayout>
  );
}
