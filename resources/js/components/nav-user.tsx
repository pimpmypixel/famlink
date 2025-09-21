import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImpersonationModal } from '@/components/impersonation/impersonation-modal';
import { useState } from 'react';

export function NavUser() {
    const { auth, isImpersonating } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    const { state } = useSidebar();
    const [showImpersonateModal, setShowImpersonateModal] = useState(false);

    // Check if user is admin
    const isAdmin = auth?.user?.roles?.includes('admin') || auth?.user?.roles?.includes('super-admin');

    // Impersonation actions
    const handleLeaveImpersonation = () => {
        window.location.href = '/impersonate/leave';
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {/* Impersonation Button Above User Menu */}
                {isAdmin && (
                    <div className="mb-2">
                        {isImpersonating ? (
                            <button
                                onClick={handleLeaveImpersonation}
                                className="flex items-center gap-2 w-full px-4 py-2 border-2 border-red-500 text-red-500 bg-white rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                <span>Stop Impersonering</span>
                                <Badge variant="destructive" className="ml-auto">Aktiv</Badge>
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowImpersonateModal(true)}
                                className="flex items-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <span>Impersoner Bruger</span>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* Use the shared ImpersonationModal */}
                <ImpersonationModal
                    isOpen={showImpersonateModal}
                    onOpenChange={setShowImpersonateModal}
                />

                {/* User Menu */}
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
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}