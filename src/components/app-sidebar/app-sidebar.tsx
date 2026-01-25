"use client";
import {
  SettingsIcon,
  GalleryVerticalIcon,
  AudioWaveformIcon,
  CommandIcon,
  KeyIcon,
  ClockFadingIcon,
  WebhookIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { UserSidebarButton } from "@/features/auth";

import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";

const teams = [
  {
    name: "Acme Inc.",
    logo: GalleryVerticalIcon,
    plan: "Enterprise",
  },
  {
    name: "Monsters Inc.",
    logo: AudioWaveformIcon,
    plan: "Startup",
  },
  {
    name: "Stark Industries",
    logo: CommandIcon,
    plan: "Free",
  },
];

const mainNavData = [
  {
    title: "Wokflows",
    href: "/workflows",
    icon: WebhookIcon,
  },
  {
    title: "Credentials",
    href: "/credentials",
    icon: KeyIcon,
  },
  {
    title: "Executions",
    href: "/executions",
    icon: ClockFadingIcon,
  },
];

const settings = [
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavData} label="Main Menu" />
        <NavMain items={settings} label="Settings" />
      </SidebarContent>

      <SidebarFooter>
        <UserSidebarButton />
      </SidebarFooter>
    </Sidebar>
  );
};
