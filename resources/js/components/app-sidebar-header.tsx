import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ImpersonationModal } from '@/components/impersonation/impersonation-modal';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { isImpersonating, impersonatableUsers, auth } = usePage<SharedData>().props;
    const [showImpersonateModal, setShowImpersonateModal] = useState(false);

    const isAdmin = auth?.user?.roles?.includes('admin') || auth?.user?.roles?.includes('super-admin');

    const handleImpersonate = (userId: string) => {
        router.get(`/impersonate/take/${userId}`);
        setShowImpersonateModal(false);
    };

    const handleLeaveImpersonation = () => {
        router.get('/impersonate/leave');
    };

    return (
        <>
            {/* Official Status Banner - Enhanced Danish branding */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 px-4 border-b border-blue-500/30 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-wide">Din stemme, din styrke</span>
                            <span className="text-xs text-blue-100/80 font-medium">Officiel Platform</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                            <span className="text-xs text-blue-100 font-medium">Sikker & Krypteret</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-100 font-medium">Ministerie-godkendt</span>
                    </div>
                </div>
            </div>

            {isImpersonating && (
                <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Impersonerer bruger</span>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLeaveImpersonation}
                        className="text-red-600 hover:bg-red-100 border border-red-300"
                    >
                        Stop Impersonering
                    </Button>
                </div>
            )}

            {isAdmin && !isImpersonating && impersonatableUsers && impersonatableUsers.length > 0 && (
                <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Admin: Impersoner bruger</span>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setShowImpersonateModal(true);
                        }}
                        className="text-blue-600 hover:bg-blue-100 border border-blue-300"
                    >
                        Vælg bruger
                    </Button>
                </div>
            )}

            <ImpersonationModal
                isOpen={showImpersonateModal}
                onOpenChange={setShowImpersonateModal}
            />

            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </header>
        </>
    );
}
