"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedIn, useOrganization, UserButton, useUser } from "@clerk/nextjs";

export function NavUser() {
  const { user } = useUser();
  const { membership, organization } = useOrganization();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage
              src={organization?.imageUrl}
              alt={user.username || ""}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {membership?.roleName || "Super Admin"}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {user.emailAddresses[0].emailAddress}
            </span>
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
