"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { StudioSidebarHeader } from "./studio-sidebar-header";


export const StudioSidebar = () => {

    const pathname =usePathname();

    return ( 
        <Sidebar className="pt-16 z-40" collapsible="icon">
            <SidebarContent className="bg-background">
                
                <SidebarGroup>
                <SidebarMenu>
                    <StudioSidebarHeader/>

                <SidebarMenuItem> 
                <SidebarMenuButton isActive={pathname === "/studio"} tooltip="動画コンテンツ" asChild>
                    <Link href="/studio">
                    <VideoIcon className="size-5"/>
                    <span className="text-sm">コンテンツ</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem> 
                <Separator/>
                <SidebarMenuItem>
                <SidebarMenuButton tooltip="ホームへ戻る" asChild>
                    <Link href="/">
                    <LogOutIcon className="size-5"/>
                    <span className="text-sm">ホームへ戻る</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
     );
}
 
