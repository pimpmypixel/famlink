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
            {/* Official Status Banner - Discreet version for authenticated users */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 border-b border-blue-700">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span className="font-medium">Officiel Platform</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1 text-blue-100">
                            <span>•</span>
                            <span>Sikker & Krypteret</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-100">
                        <span>Ministerie-godkendt</span>
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
