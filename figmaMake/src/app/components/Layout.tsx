import { Outlet } from "react-router";
import { MobileNavBar } from "@/app/components/MobileNavBar";

export function Layout() {
  return (
    <div className="relative min-h-screen bg-white">
      <Outlet />
      <MobileNavBar />
    </div>
  );
}