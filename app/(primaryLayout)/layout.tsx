import React, { Suspense } from "react";
import { TopBar } from "@/components/ui/top-bar";
import SidebarNav from "@/components/ui/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* 1. Global Navigation Frame */}
      <TopBar />

      {/* 2. Grid Container Layout Canvas */}
      <div className="mx-auto grid w-full  max-w-7xl flex-1 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4 sm:px-6 lg:px-8">
        {/* Left Sidebar Channel */}
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] flex-col gap-2 overflow-y-auto md:flex">
          <Suspense>
            <SidebarNav />
          </Suspense>
        </aside>

        {/* 3. Main Stream Content Channel */}
        <main className="md:col-span-3 min-w-0 ">{children}</main>
      </div>
    </div>
  );
}
