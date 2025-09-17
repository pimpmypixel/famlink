"use client"

import { SpeedDial } from "@/components/speed-dial"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash } from "lucide-react"

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Editor" },
]

export function TableDemo() {
  const getRowActions = (userId: number) => [
    { icon: Eye, label: "View Details", onClick: () => alert(`Viewing user ${userId}`) },
    { icon: Pencil, label: "Edit User", onClick: () => alert(`Editing user ${userId}`) },
    {
      icon: Trash,
      label: "Delete User",
      onClick: () => alert(`Deleting user ${userId}`),
      className: "bg-destructive/80 hover:bg-destructive text-destructive-foreground",
    },
  ]

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Table Context</CardTitle>
        <CardDescription>Using the speed dial for row-specific actions in a data table.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex justify-end">
                  <SpeedDial actions={getRowActions(user.id)} direction="left" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
