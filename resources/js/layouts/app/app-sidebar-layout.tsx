import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { SpeedDial } from '@/components/speed-dial';
import { MessageCircle, Settings, Info } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <div style={{ position: 'fixed', bottom: '5%', right: '5%', zIndex: 50 }}>
                    <SpeedDial
                        actions={[
                            {
                                icon: MessageCircle,
                                label: 'Ask AI',
                                onClick: () => {/* open modal logic here */},
                            },
                            {
                                icon: Settings,
                                label: 'Settings',
                                onClick: () => {/* settings logic here */},
                            },
                            {
                                icon: Info,
                                label: 'Info',
                                onClick: () => {/* info logic here */},
                            },
                        ]}
                        direction="up"
                        triggerSize="lg"
                        style="circle"
                    />
                </div>
            </AppContent>
        </AppShell>
    );
}
