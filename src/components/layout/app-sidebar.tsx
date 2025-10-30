'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  GitCompareArrows,
  LogOut,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Overview' },
  { href: '/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/data-sync', icon: GitCompareArrows, label: 'Data Sync' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <Icons.logo className="w-8 h-8 text-primary" />
          <span className="text-lg font-semibold font-headline group-data-[collapsible=icon]:hidden">
            KP ERP
          </span>
           {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setOpenMobile(false)}
            >
              <Menu />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Button
                asChild
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </>
  );
}
