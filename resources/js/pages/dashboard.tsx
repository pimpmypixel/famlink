import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, UserCheck, MessageSquare, Clock } from 'lucide-react';

interface DashboardProps {
    stats?: {
        users_count: number;
        families_count: number;
        timeline_items_count: number;
        comments_count: number;
        average_session_time: string;
    } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Oversigt',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Users & Families Stats */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                        {stats ? (
                            <div className="flex flex-col justify-center h-full p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Brugere & Familier</h3>
                                        <p className="text-sm text-muted-foreground">System oversigt</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Brugere:</span>
                                        <span className="text-2xl font-bold">{stats.users_count}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Familier:</span>
                                        <span className="text-2xl font-bold">{stats.families_count}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        )}
                    </div>

                    {/* Timeline Items & Comments Stats */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                        {stats ? (
                            <div className="flex flex-col justify-center h-full p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <MessageSquare className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Indhold & Kommentarer</h3>
                                        <p className="text-sm text-muted-foreground">Platform aktivitet</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Sagsindlæg:</span>
                                        <span className="text-2xl font-bold">{stats.timeline_items_count}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Kommentarer:</span>
                                        <span className="text-2xl font-bold">{stats.comments_count}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        )}
                    </div>

                    {/* Average Session Time Stats */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                        {stats ? (
                            <div className="flex flex-col justify-center h-full p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Session Tid</h3>
                                        <p className="text-sm text-muted-foreground">Bruger engagement</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center h-16">
                                    <span className="text-3xl font-bold">{stats.average_session_time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">Gennemsnitlig session tid</p>
                            </div>
                        ) : (
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        )}
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
