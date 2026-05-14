import { useDevice } from "@/lib/device";
import { ExecutorBottomNav } from "./ExecutorBottomNav";
import { ExecutorSidebar } from "./ExecutorSidebar";

export function AppLayout({ children, hideChrome }: { children: React.ReactNode; hideChrome?: boolean }) {
  const { device } = useDevice();

  if (device === "desktop") {
    return (
      <div className="flex min-h-screen bg-[#F7F8FA]">
        {!hideChrome && <ExecutorSidebar />}
        <main className={`flex-1 ${hideChrome ? "" : "ml-56"} max-w-4xl mx-auto px-8 py-8`}>
          {children}
        </main>
      </div>
    );
  }

  // Mobile
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] max-w-[390px] mx-auto">
      {children}
      {!hideChrome && <ExecutorBottomNav />}
    </div>
  );
}
