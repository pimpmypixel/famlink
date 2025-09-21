import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, UserCheck } from "lucide-react";

export type UserColumn = {
    id: string;
    name: string;
    email: string;
    role: string;
    family_name?: string;
};

export const columns: ColumnDef<UserColumn>[] = [
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        // This will be handled by the parent component
                        const event = new CustomEvent('impersonate-user', { detail: user.id });
                        window.dispatchEvent(event);
                    }}
                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                    title="Impersonate this user"
                >
                    <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </Button>
            );
        },
    },
    {
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={row.getToggleExpandedHandler()}
                    className="h-8 w-8 p-0"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4 rotate-90" />
                    )}
                </Button>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 font-medium"
                >
                    Name
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("name")}</div>;
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 font-medium"
                >
                    Email
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>;
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 font-medium"
                >
                    Role
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-sm">{row.getValue("role")}</div>;
        },
    },
    {
        accessorKey: "family_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 font-medium"
                >
                    Family
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-sm">{row.getValue("family_name")}</div>;
        },
    },
];
