import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge'

export function NavUser() {
    const { auth, isImpersonating } = usePage<SharedData>().props;
    const isMobile = useIsMobile();

    // Safely get sidebar state, fallback to 'expanded' if not available
    let sidebarState = 'expanded';
    try {
        const { state } = useSidebar();
        sidebarState = state;
    } catch (error) {
        // SidebarProvider not available, use default state
        console.warn('SidebarProvider not available, using default sidebar state');
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent">
                            <UserInfo user={auth.user} />
                            <div className="flex items-center gap-1">
                                <Badge variant={isImpersonating ? 'destructive' : 'outline'} className="flex items-center gap-1">
                                    {isImpersonating && <AlertTriangle className="h-3 w-3" />}
                                    {/* {isImpersonating ? 'Imp.' : (auth.user.roles?.[0] || 'No role')} */}
                                </Badge>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : sidebarState === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
