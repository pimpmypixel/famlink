import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, AlertTriangle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge'

export function NavUser() {
    const { auth, isImpersonating, impersonatableUsers } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    const { state } = useSidebar();
    const [showImpersonateModal, setShowImpersonateModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Check if user is admin
    const isAdmin = auth?.user?.roles?.includes('admin') || auth?.user?.roles?.includes('super-admin');

    // Impersonation actions
    const handleImpersonate = (userId: string) => {
        window.location.href = `/impersonate/take/${userId}`;
        setShowImpersonateModal(false);
    };
    const handleLeaveImpersonation = () => {
        window.location.href = '/impersonate/leave';
    };

    // Arrow key navigation for modal
    useEffect(() => {
        if (!showImpersonateModal) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!Array.isArray(impersonatableUsers) || impersonatableUsers.length === 0) return;
            if (e.key === 'ArrowDown') {
                setSelectedIndex((prev) => Math.min(prev + 1, impersonatableUsers.length - 1));
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
                e.preventDefault();
            } else if (e.key === 'Enter') {
                handleImpersonate(impersonatableUsers[selectedIndex].id);
                e.preventDefault();
            } else if (e.key === 'Escape') {
                setShowImpersonateModal(false);
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showImpersonateModal, impersonatableUsers, selectedIndex]);

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
                                <UserCheck className="h-4 w-4" />
                                <span>Impersoner Bruger</span>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </button>
                        )}
                        {/* Modal for user selection */}
                        {showImpersonateModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6 relative">
                                    <h3 className="font-semibold mb-4">Vælg en bruger at impersonere</h3>
                                    {Array.isArray(impersonatableUsers) && impersonatableUsers.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto">
                                            {impersonatableUsers.map((user: { id: string; name: string; email: string; role: string }, idx: number) => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => handleImpersonate(user.id)}
                                                    className={`w-full text-left p-3 rounded mb-1 transition-colors border border-sidebar-border/30 last:mb-0 ${selectedIndex === idx ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                                                    tabIndex={-1}
                                                >
                                                    <div className="font-medium">{typeof user.name === 'string' ? user.name : 'Unknown User'}</div>
                                                    <div className="text-sm text-muted-foreground">{typeof user.email === 'string' ? user.email : 'No email'}</div>
                                                    <div className="text-xs text-muted-foreground capitalize mt-1">Rolle: {user.role === 'far' ? 'Far' : user.role === 'mor' ? 'Mor' : typeof user.role === 'string' ? user.role : 'Unknown'}</div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-muted-foreground">
                                            Ingen brugere tilgængelige
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setShowImpersonateModal(false)}
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
                                        aria-label="Luk"
                                    >
                                        ×
                                    </button>
                                    <div className="mt-4 text-xs text-muted-foreground">Brug pil op/ned og Enter for at vælge. Esc for at lukke.</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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
