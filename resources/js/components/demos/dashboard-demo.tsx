"use client"

import { SpeedDial } from "@/components/speed-dial"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Settings, BarChart } from "lucide-react"

export function DashboardDemo() {
  const dashboardActions = [
    { icon: LayoutDashboard, label: "Add Widget", onClick: () => alert("Add Widget") },
    { icon: BarChart, label: "View Analytics", onClick: () => alert("View Analytics") },
    { icon: Settings, label: "Dashboard Settings", onClick: () => alert("Dashboard Settings") },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Context</CardTitle>
        <CardDescription>A speed dial fixed in a container, ideal for global actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">A dashboard panel</p>
          <div className="absolute bottom-4 right-4">
            <SpeedDial actions={dashboardActions} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
