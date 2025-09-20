import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export type UserColumn = {
    id: string;
    name: string;
    email: string;
    role: string;
    family_name?: string;
};

export const columns: ColumnDef<UserColumn>[] = [
    {
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={row.getToggleExpandedHandler()}
                    className="p-1 h-6 w-6"
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
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "family_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Family
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        // This will be handled by the parent component
                        const event = new CustomEvent('impersonate-user', { detail: user.id });
                        window.dispatchEvent(event);
                    }}
                >
                    Impersonate
                </Button>
            );
        },
    },
];