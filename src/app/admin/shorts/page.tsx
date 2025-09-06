// src/app/admin/shorts/page.tsx
'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { shorts } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";

export default function AdminShortsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Shorts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Short</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Short</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" placeholder="Shorts Title" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-src" className="text-right">Video URL</Label>
                <Input id="video-src" placeholder="https://example.com/video.mp4" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnail-url" className="text-right">Thumbnail URL</Label>
                <Input id="thumbnail-url" placeholder="https://example.com/image.jpg" className="col-span-3" />
              </div>
              <Button>Save Short</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shorts.map((short, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{short.title}</TableCell>
                  <TableCell>{short.views}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon"><Edit className="w-4 h-4"/></Button>
                        <Button variant="destructive" size="icon"><Trash className="w-4 h-4"/></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
