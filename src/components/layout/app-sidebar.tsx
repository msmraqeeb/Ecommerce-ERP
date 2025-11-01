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
import { logout } from '@/lib/auth';
import type { User } from '@/lib/types';

const navItems = [
  { href: '/', icon: Home, label: 'Overview', roles: ['admin', 'viewer'] },
  { href: '/orders', icon: ShoppingCart, label: 'Orders', roles: ['admin', 'viewer'] },
  { href: '/products', icon: Package, label: 'Products', roles: ['admin', 'viewer'] },
  { href: '/customers', icon: Users, label: 'Customers', roles: ['admin', 'viewer'] },
  { href: '/data-sync', icon: GitCompareArrows, label: 'Data Sync', roles: ['admin'] },
];

export function AppSidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

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
          {filteredNavItems.map((item) => (
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
        <form action={logout}>
            <Button type="submit" variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
            </Button>
        </form>
      </SidebarFooter>
    </>
  );
}
