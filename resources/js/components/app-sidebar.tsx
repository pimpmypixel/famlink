import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard, timeline, intro, userguide } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Clock, FileText, Shield, Lock } from 'lucide-react';
import AppLogo from './app-logo';
import { MessageSquare, Plus, Settings, Archive, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Brugervejledning',
        href: userguide(),
        icon: BookOpen,
    },
    {
        title: 'Oversigt',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Tidslinje',
        href: timeline(),
        icon: Clock,
    },
]

const footerNavItems: NavItem[] = [
    {
        title: 'Projektbeskrivelse',
        href: intro(),
        icon: FileText,
    },
    {
        title: 'Familieretshuset',
        href: 'https://familieretshuset.dk/',
        icon: BookOpen,
    },
];

export function AppSidebar() {
  const { url } = usePage();
  const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                
                {/* Discreet trust indicators in sidebar */}
                <div className="px-3 py-2 border-t border-sidebar-border/50">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 text-blue-600" />
                        <span>Officiel Platform</span>
                        <Lock className="h-3 w-3 text-green-600" />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
