// src/app/admin/playlists/page.tsx
'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { videos } from "@/lib/data";

const playlists = [
  { name: 'Watch Later', videoCount: 12 },
  { name: 'Favorites', videoCount: 25 },
  { name: 'Learn Coding', videoCount: 58 },
];

export default function AdminPlaylistsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Playlists</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Playlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" placeholder="Playlist Name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videos" className="text-right">Videos</Label>
                <div className="col-span-3">
                    <p className="text-sm text-muted-foreground mb-2">Select videos to add to this playlist.</p>
                     <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select videos..." />
                        </SelectTrigger>
                        <SelectContent>
                            {videos.map(v => <SelectItem key={v.title} value={v.title}>{v.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <Button>Save Playlist</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Playlist Name</TableHead>
                <TableHead>Video Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((playlist, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{playlist.name}</TableCell>
                  <TableCell>{playlist.videoCount}</TableCell>
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
