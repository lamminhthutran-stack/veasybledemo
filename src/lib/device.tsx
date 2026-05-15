import { createContext, useContext, useState } from "react";
import { useLocation } from "@tanstack/react-router";

export type Device = "mobile" | "desktop";

export const DeviceContext = createContext<{ device: Device; setDevice: (d: Device) => void }>({
  device: "mobile",
  setDevice: () => {},
});

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<Device>("mobile");
  return <DeviceContext.Provider value={{ device, setDevice }}>{children}</DeviceContext.Provider>;
}

export const useDevice = () => useContext(DeviceContext);

export function DeviceToggle() {
  const { device, setDevice } = useDevice();
  const { pathname } = useLocation();

  if (pathname.startsWith("/ops")) return null;

  return (
    <div className="flex bg-gray-100 rounded-[5px] p-0.5 text-xs font-semibold">
      <button
        onClick={() => setDevice("mobile")}
        className={`px-2 py-1 rounded-[5px] transition-colors ${device === "mobile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}
      ></button>
      <button
        onClick={() => setDevice("desktop")}
        className={`px-2 py-1 rounded-[5px] transition-colors ${device === "desktop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}
      ></button>
    </div>
  );
}
