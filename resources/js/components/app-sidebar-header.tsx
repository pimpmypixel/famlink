import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { AlertTriangle, UserX, ChevronDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { isImpersonating, impersonatableUsers, auth } = usePage<SharedData>().props;
    const [showImpersonateDropdown, setShowImpersonateDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdmin = auth?.user?.roles?.includes('admin') || auth?.user?.roles?.includes('super-admin');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowImpersonateDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleImpersonate = (userId: string) => {
        router.get(`/impersonate/take/${userId}`);
        setShowImpersonateDropdown(false);
    };

    const handleLeaveImpersonation = () => {
        router.get('/impersonate/leave');
    };

    return (
        <>
            {/* {isImpersonating && (
                <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Impersonerer bruger</span>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLeaveImpersonation}
                        className="text-red-600 hover:bg-red-100 border border-red-300"
                    >
                        <UserX className="h-4 w-4 mr-1" />
                        Stop Impersonering
                    </Button>
                </div>
            )}

            {isAdmin && !isImpersonating && impersonatableUsers && impersonatableUsers.length > 0 && (
                <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Admin: Impersoner bruger</span>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowImpersonateDropdown(!showImpersonateDropdown)}
                            className="text-blue-600 hover:bg-blue-100 border border-blue-300"
                        >
                            Vælg bruger
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>

                        {showImpersonateDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                                {impersonatableUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleImpersonate(user.id)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-600">{user.email}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
