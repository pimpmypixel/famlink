import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { AlertTriangle, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
   /*  const { isImpersonating } = usePage<SharedData>().props;

    const handleLeaveImpersonation = () => {
        router.get('/impersonate/leave');
    }; */

    return (
        <>
            {/* {isImpersonating && (
                <div className="text-white px-4 py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Impersonerer</span>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLeaveImpersonation}
                        className="text-red-600 hover:bg-gray-100 border-1 border-red-600"
                    >
                        <UserX className="h-4 w-4 mr-1" />
                        Stop Impersonering
                    </Button>
                </div>
            )} */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </header>
        </>
    );
}
