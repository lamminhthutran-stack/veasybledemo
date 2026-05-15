import { ExecutorBottomNav } from "./ExecutorBottomNav";

export function AppLayout({ children, hideChrome }: { children: React.ReactNode; hideChrome?: boolean }) {
  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] flex justify-center">
      <div 
        className="flex flex-col min-h-screen bg-white w-full max-w-[390px] relative shadow-2xl overflow-x-hidden"
        style={{ paddingBottom: "calc(65px + env(safe-area-inset-bottom))" }}
      >
        {children}
        <ExecutorBottomNav />
      </div>
    </div>
  );
}
