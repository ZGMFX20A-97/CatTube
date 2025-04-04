'use client'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";

const items = [
    {
        title: "ホーム",
        url: "/",
        icon: HomeIcon
    },
    {
        title: "サブスクリプション",
        url: "/feed/subscriptions",
        icon: PlaySquareIcon,
        auth: true
    },
    {
        title: "トレンド",
        url: "/feed/trending",
        icon: FlameIcon
    },
]

const MainSection = () => {

    const {isSignedIn} = useAuth();
    const clerk = useClerk();

    return ( 
        <SidebarGroup>
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
 
export default MainSection;