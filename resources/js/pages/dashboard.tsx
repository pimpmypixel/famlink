import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, MessageSquare, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

interface TimelineCase {
    id: string;
    title: string;
    content: string;
    category: {
        id: string;
        name: string;
        [key: string]: any;
    };
    created_at: string;
    family_name: string;
    user_name: string;
    user_role: string;
}

interface DashboardProps {
    stats?: {
        users_count: number;
        families_count: number;
        timeline_items_count: number;
        comments_count: number;
        average_session_time: string;
    } | null;
    timelineCases?: TimelineCase[] | null;
    userRole?: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Oversigt',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats, timelineCases, userRole }: DashboardProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedCases = timelineCases ? 
        timelineCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
    
    const totalPages = timelineCases ? Math.ceil(timelineCases.length / itemsPerPage) : 0;

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
                
                {/* Timeline Cases Datatable for Social Workers */}
                {userRole === 'myndighed' && timelineCases ? (
                    <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="text-xl font-semibold">Mine Sager</h3>
                                    <p className="text-sm text-muted-foreground">Oversigt over dine sagsindlæg</p>
                                </div>
                            </div>

                            {timelineCases.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Ingen sager fundet</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-3 px-4 font-medium">Titel</th>
                                                    <th className="text-left py-3 px-4 font-medium">Familie</th>
                                                    <th className="text-left py-3 px-4 font-medium">Bruger</th>
                                                    <th className="text-left py-3 px-4 font-medium">Kategori</th>
                                                    <th className="text-left py-3 px-4 font-medium">Oprettet</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedCases.map((case_: TimelineCase) => (
                                                    <tr key={case_.id} className="border-b hover:bg-muted/50">
                                                        <td className="py-3 px-4">
                                                            <div>
                                                                <div className="font-medium">{case_.title}</div>
                                                                <div className="text-sm text-muted-foreground line-clamp-2">{case_.content}</div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm">
                                                            <div>
                                                                {typeof case_.family_name === 'string'
                                                                    ? case_.family_name
                                                                    : (case_.family_name && typeof case_.family_name === 'object' && 'name' in case_.family_name)
                                                                        ? (case_.family_name as { name: string }).name
                                                                        : 'Unknown Family'}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm">
                                                            <div>
                                                                {typeof case_.user_name === 'string'
                                                                    ? case_.user_name
                                                                    : (case_.user_name && typeof case_.user_name === 'object' && 'name' in case_.user_name)
                                                                        ? (case_.user_name as { name: string }).name
                                                                        : 'Unknown User'}
                                                                <div className="text-xs text-muted-foreground capitalize">
                                                                    {case_.user_role === 'far' ? 'Far' :
                                                                     case_.user_role === 'mor' ? 'Mor' :
                                                                     case_.user_role}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm capitalize">
                                                            <div>{case_.category.name}</div>
                                                        </td> 
                                                        <td className="py-3 px-4 text-sm">
                                                            <div>
                                                                {typeof case_.created_at === 'string' ? case_.created_at : 'Unknown Date'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6">
                                            <div className="text-sm text-muted-foreground">
                                                Viser {((currentPage - 1) * itemsPerPage) + 1} til {Math.min(currentPage * itemsPerPage, timelineCases.length)} af {timelineCases.length} sager
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                                                >
                                                    Forrige
                                                </button>
                                                <span className="text-sm">
                                                    Side {currentPage} af {totalPages}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                                                >
                                                    Næste
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
