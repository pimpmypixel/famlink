import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { dashboard, timeline, intro, userguide } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Clock, FileText, Shield, Lock, UserCheck } from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';
import { ImpersonationModal } from '@/components/impersonation/impersonation-modal';
import { useState } from 'react';

interface ExtendedNavItem extends NavItem {
    onClick?: () => void;
}

export function AppSidebar() {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const { auth } = usePage<SharedData>().props;
    const [showImpersonateModal, setShowImpersonateModal] = useState(false);

    // Check if user is admin
    const isAdmin = auth?.user?.roles?.includes('admin') || auth?.user?.roles?.includes('super-admin');

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

    const footerNavItems: ExtendedNavItem[] = [
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

    // Add impersonation button for admins
    if (isAdmin) {
        footerNavItems.push({
            title: isCollapsed ? '' : 'Impersoner',
            href: '#',
            icon: UserCheck,
            onClick: () => setShowImpersonateModal(true),
        });
    }

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

                {!isCollapsed && (
                    /* Enhanced trust indicators with Danish slogan */
                    <div className="px-3 py-3 border-t border-sidebar-border/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="text-sm font-bold text-blue-700 tracking-wide">Din stemme, din styrke</div>
                            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3 text-blue-600" />
                                    <span>Officiel Platform</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Lock className="h-3 w-3 text-green-600" />
                                    <span>Sikker</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
                <ImpersonationModal
                    isOpen={showImpersonateModal}
                    onOpenChange={setShowImpersonateModal}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
