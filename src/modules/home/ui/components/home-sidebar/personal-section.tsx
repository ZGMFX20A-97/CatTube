'use client'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";

const items = [
    {
        title: "履歴",
        url: "/playlists/history",
        icon: HistoryIcon,
        auth: true
    },
    {
        title: "お気に入り",
        url: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true
    },
    {
        title: "全てのプレイリスト",
        url: "/playlists",
        icon: ListVideoIcon,
        auth: true
    },
]

const PersonalSection = () => {

    const {isSignedIn} = useAuth();
    const clerk = useClerk();

    return ( 
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                   {items.map((item) =>(
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={item.title} asChild isActive={false} onClick={(e)=>{
                            if(!isSignedIn && item.auth){
                                e.preventDefault();
                                return clerk.openSignIn();
                            }
                        }}>
                        <Link href={item.url} className="flex items-center gap-4">
                        <item.icon/>
                        <span className="text-sm">{item.title}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                   )
                    
                   ) }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
     );
}
 
export default PersonalSection;