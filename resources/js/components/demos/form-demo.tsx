import { SpeedDial } from "@/components/speed-dial"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Printer, Trash2 } from "lucide-react"

export function FormDemo() {
  const formActions = [
    { icon: Save, label: "Save as Draft", onClick: () => alert("Save as Draft") },
    { icon: Printer, label: "Print Form", onClick: () => alert("Print Form") },
    { icon: Trash2, label: "Clear Form", onClick: () => alert("Clear Form") },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Context</CardTitle>
        <CardDescription>Providing secondary actions without cluttering the main form UI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <SpeedDial actions={formActions} direction="up" />
            <Button type="submit" onClick={(e) => e.preventDefault()}>
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
