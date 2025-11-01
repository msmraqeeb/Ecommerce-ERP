"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import type { User } from '@/lib/types';


export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar user={user} />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="p-2 hidden md:block">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
