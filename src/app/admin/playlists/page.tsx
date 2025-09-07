// src/app/admin/playlists/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addPlaylist, deletePlaylist, getAdminPlaylists, getVideos, updatePlaylist } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminPlaylistsPage() {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', videoIds: [] });
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const fetchPlaylists = async () => {
    try {
      const data = await getAdminPlaylists();
      setPlaylists(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load playlists." });
    }
  };

  const fetchVideos = async () => {
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "Failed to load videos." });
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchVideos();
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      // Assuming user_id is handled by backend or you have access to it
      const user = JSON.parse(localStorage.getItem('user'));
      await addPlaylist({ ...newPlaylist, user_id: user.id });
      setNewPlaylist({ name: '', videoIds: [] });
      fetchPlaylists();
      toast({ title: "Success", description: "Playlist created." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create playlist." });
    }
  };

  const handleDeletePlaylist = async (id: number) => {
    try {
      await deletePlaylist(id);
      fetchPlaylists();
      toast({ title: "Success", description: "Playlist deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete playlist." });
    }
  };

  const handleEditClick = (playlist) => {
    setEditingPlaylist({ ...playlist, videoIds: playlist.videos?.map(v => v.id) || [] });
  };
  
  const handleUpdatePlaylist = async () => {
    try {
      await updatePlaylist(editingPlaylist);
      setEditingPlaylist(null);
      fetchPlaylists();
      toast({ title: "Success", description: "Playlist updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update playlist." });
    }
  };

  const renderVideoSelection = (playlistState, setPlaylistState) => (
    <div className="col-span-3 space-y-2 max-h-60 overflow-y-auto">
        <p className="text-sm text-muted-foreground mb-2">Select videos to add to this playlist.</p>
        {videos.map((video: any) => (
            <div key={video.id} className="flex items-center space-x-2">
                <Checkbox
                    id={`video-${video.id}`}
                    checked={playlistState.videoIds.includes(video.id)}
                    onCheckedChange={(checked) => {
                        const newVideoIds = checked
                            ? [...playlistState.videoIds, video.id]
                            : playlistState.videoIds.filter(id => id !== video.id);
                        setPlaylistState({ ...playlistState, videoIds: newVideoIds });
                    }}
                />
                <Label htmlFor={`video-${video.id}`}>{video.title}</Label>
            </div>
        ))}
    </div>
  );


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
                <Input id="name" value={newPlaylist.name} onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})} placeholder="Playlist Name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="videos" className="text-right pt-2">Videos</Label>
                {renderVideoSelection(newPlaylist, setNewPlaylist)}
              </div>
              <Button onClick={handleCreatePlaylist}>Save Playlist</Button>
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
              {playlists.map((playlist: any) => (
                <TableRow key={playlist.id}>
                  <TableCell className="font-medium">{playlist.name}</TableCell>
                  <TableCell>{playlist.videos?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => handleEditClick(playlist)}><Edit className="w-4 h-4"/></Button>
                            </DialogTrigger>
                            {editingPlaylist && (
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Edit Playlist</DialogTitle></DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                          <Label htmlFor="edit-name" className="text-right">Name</Label>
                                          <Input id="edit-name" value={editingPlaylist.name} onChange={(e) => setEditingPlaylist({...editingPlaylist, name: e.target.value})} className="col-span-3" />
                                      </div>
                                      <div className="grid grid-cols-4 items-start gap-4">
                                          <Label htmlFor="edit-videos" className="text-right pt-2">Videos</Label>
                                           {renderVideoSelection(editingPlaylist, setEditingPlaylist)}
                                      </div>
                                      <Button onClick={handleUpdatePlaylist}>Save Changes</Button>
                                    </div>
                                </DialogContent>
                            )}
                        </Dialog>
                        <Button variant="destructive" size="icon" onClick={() => handleDeletePlaylist(playlist.id)}><Trash className="w-4 h-4"/></Button>
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
