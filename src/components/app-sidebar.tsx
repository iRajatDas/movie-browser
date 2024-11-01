"use client";

import * as React from "react";
import { Popcorn, Sparkles } from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
// import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Movie Browser",
      logo: Popcorn,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Favorites",
      url: "/favorites",
      icon: Sparkles,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        {/* <NavMain items={data.navMain} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
