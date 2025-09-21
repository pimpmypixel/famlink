import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    // Get sidebar state from Inertia
    const page = usePage<SharedData>();
    const isOpen = page.props.sidebarOpen ?? true;

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <SidebarProvider defaultOpen={isOpen}>
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AppLayoutTemplate>
            </SidebarProvider>
        </div>
    );
};
