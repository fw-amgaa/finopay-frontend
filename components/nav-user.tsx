"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedIn, useOrganization, UserButton, useUser } from "@clerk/nextjs";

export function NavUser() {
  const { user } = useUser();
  const { membership } = useOrganization();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-4"
        >
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {membership?.roleName || "Super Admin"}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {user.emailAddresses[0].emailAddress}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
