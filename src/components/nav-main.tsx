"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    onClick?: () => void;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            onClick={item.onClick}
          >
            {item.url ? (
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            ) : (
              <div
                className={sidebarMenuButtonVariants({
                  className: "cursor-pointer",
                })}
              >
                <item.icon />
                <span>{item.title}</span>
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
