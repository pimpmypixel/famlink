import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
    sidebarOpen?: boolean;
}

export function AppShell({ children, variant = 'header', sidebarOpen }: AppShellProps) {
    // Always call usePage at the top level since we're in an Inertia context
    const page = usePage<SharedData>();

    // Get sidebar state from props or page data, defaulting to open
    const isOpen = sidebarOpen !== undefined ? sidebarOpen : (page.props.sidebarOpen ?? true);

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    // SidebarProvider is now provided at AppLayout level, so just render children
    return <>{children}</>;
}
