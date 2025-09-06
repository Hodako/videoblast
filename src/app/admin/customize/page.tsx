// src/app/admin/customize/page.tsx
'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { videos } from "@/lib/data"
import { GripVertical } from "lucide-react"

export default function CustomizePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customize Site</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Change the look and feel of your site.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input type="color" id="primary-color" defaultValue="#FF4757" className="w-12 h-10 p-1" />
                <Input type="text" defaultValue="#FF4757" />
              </div>
              <p className="text-xs text-muted-foreground">Used for buttons, links, and highlights.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input type="color" id="accent-color" defaultValue="#E25822" className="w-12 h-10 p-1" />
                <Input type="text" defaultValue="#E25822" />
              </div>
               <p className="text-xs text-muted-foreground">Used for interactive elements.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Input id="font-family" defaultValue="PT Sans" />
              <p className="text-xs text-muted-foreground">Enter a font name from Google Fonts.</p>
            </div>
            <div className="flex items-end">
                <Button>Save Theme</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promotional Banner</CardTitle>
            <CardDescription>Edit the text displayed in the top promotional banner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea defaultValue="🎬 READY TO LEARN 📚 Don't Miss the Course Sale! GET 30% OFF!" />
            <Button>Save Banner Text</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Landing Page Videos</CardTitle>
            <CardDescription>Drag and drop to reorder the videos on the main page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                {videos.slice(0, 5).map((video, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-muted">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <span className="font-medium text-sm">{video.title}</span>
                    </div>
                ))}
            </div>
            <Button className="mt-4">Save Order</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
