import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from './nested-table/data-table';
import { columns, UserColumn } from './nested-table/columns';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { router } from '@inertiajs/react';
import { Search, Users, X } from 'lucide-react';

interface ImpersonationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ImpersonatableUser {
    id: string;
    name: string;
    email: string;
    role?: string;
    family_name?: string;
}

type TabType = 'role' | 'family';

export function ImpersonationModal({ isOpen, onOpenChange }: ImpersonationModalProps) {
    const { impersonatableUsers } = usePage<SharedData>().props;

    const [activeTab, setActiveTab] = useState<TabType>('role');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleImpersonateUser = (event: CustomEvent<string>) => {
            const userId = event.detail;
            router.get(`/impersonate/take/${userId}`);
            onOpenChange(false);
        };

        window.addEventListener('impersonate-user', handleImpersonateUser as EventListener);

        return () => {
            window.removeEventListener('impersonate-user', handleImpersonateUser as EventListener);
        };
    }, [onOpenChange]);

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!impersonatableUsers) return [];

        if (!searchQuery.trim()) return impersonatableUsers;

        const query = searchQuery.toLowerCase();
        return impersonatableUsers.filter((user: ImpersonatableUser) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query) ||
            user.family_name?.toLowerCase().includes(query)
        );
    }, [impersonatableUsers, searchQuery]);

    // Group users by role
    const usersByRole = React.useMemo(() => {
        if (!filteredUsers) return {};

        const grouped: Record<string, UserColumn[]> = {};
        filteredUsers.forEach((user: ImpersonatableUser) => {
            const role = user.role || 'No Role';
            if (!grouped[role]) {
                grouped[role] = [];
            }
            grouped[role].push({
                id: user.id,
                name: user.name,
                email: user.email,
                role: role,
                family_name: user.family_name || 'No Family'
            });
        });
        return grouped;
    }, [filteredUsers]);

    // Group users by family
    const usersByFamily = React.useMemo(() => {
        if (!filteredUsers) return {};

        const grouped: Record<string, UserColumn[]> = {};
        filteredUsers.forEach((user: ImpersonatableUser) => {
            const family = user.family_name || 'No Family';
            if (!grouped[family]) {
                grouped[family] = [];
            }
            grouped[family].push({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'No Role',
                family_name: family
            });
        });
        return grouped;
    }, [filteredUsers]);

    const getRowCanExpand = () => {
        return true; // Allow expansion for all rows
    };

    const renderSubComponent = (row: { original: UserColumn }) => {
        const user = row.original;
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">User Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                        <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Role:</span>
                        <span className="text-gray-900 dark:text-gray-100">{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Family:</span>
                        <span className="text-gray-900 dark:text-gray-100">{user.family_name}</span>
                    </div>
                </div>
            </div>
        );
    };

    const tabs = [
        { id: 'role' as TabType, label: 'By Role', icon: Users },
        { id: 'family' as TabType, label: 'By Family', icon: Users }
    ];

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] md:w-[80vw] lg:w-[70vw] max-w-none h-[95vh] flex flex-col bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 shadow-2xl">
                <DialogHeader className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <DialogTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Select User to Impersonate
                    </DialogTitle>
                </DialogHeader>

                {/* Search Bar */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search users by name, email, role, or family..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 h-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredUsers.length} of {impersonatableUsers?.length || 0} users
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0 flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                <IconComponent className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="p-6">
                        {filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {searchQuery ? 'No users found' : 'No users available'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    {searchQuery
                                        ? `No users match your search for "${searchQuery}". Try adjusting your search terms.`
                                        : 'There are no users available for impersonation at this time.'
                                    }
                                </p>
                                {searchQuery && (
                                    <Button
                                        variant="outline"
                                        onClick={clearSearch}
                                        className="mt-4"
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                {activeTab === 'role' && (
                                    <div className="space-y-6">
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Users by Role
                                        </h2>
                                        {Object.entries(usersByRole).map(([role, users]) => (
                                            <div key={role} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 capitalize flex items-center justify-between">
                                                        <span>{role}</span>
                                                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                                            {users.length} user{users.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <DataTable
                                                        columns={columns}
                                                        data={users}
                                                        getRowCanExpand={getRowCanExpand}
                                                        renderSubComponent={renderSubComponent}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'family' && (
                                    <div className="space-y-6">
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Users by Family
                                        </h2>
                                        {Object.entries(usersByFamily).map(([family, users]) => (
                                            <div key={family} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between">
                                                        <span>{family}</span>
                                                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                                            {users.length} user{users.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <DataTable
                                                        columns={columns}
                                                        data={users}
                                                        getRowCanExpand={getRowCanExpand}
                                                        renderSubComponent={renderSubComponent}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}