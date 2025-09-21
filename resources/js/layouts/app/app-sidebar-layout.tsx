import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { SpeedDial } from '@/components/speed-dial';
import { MessageCircle, MessageSquareText } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import React from 'react';
import { AIChatModal } from '@/components/ai-chat-modal';
import { ApprovedUserChatModal } from '@/components/approved-user-chat-modal';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {

    const [aiModalOpen, setAIModalOpen] = React.useState(false);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden bg-gradient-to-br from-slate-50 to-blue-50">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <div style={{ position: 'fixed', bottom: '5%', right: '5%', zIndex: 50 }}>
                    <SpeedDial
                        actions={[
                            {
                                icon: MessageCircle,
                                label: 'Ask AI',
                                onClick: () => setAIModalOpen(true),
                            }
                        ]}
                        direction="up"
                        triggerSize="default"
                        style="circle"
                        triggerIcon={MessageSquareText}

                    />
                </div>
                {/* Large centered modal for AI chat */}
                <React.Suspense fallback={null}>
                  {aiModalOpen && (
                    <ApprovedUserChatModal open={aiModalOpen} onOpenChange={setAIModalOpen} />
                  )}
                </React.Suspense>
            </AppContent>
        </AppShell>
    );
}
