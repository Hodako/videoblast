// src/app/admin/creators/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminCreators, addCreator, updateCreator, deleteCreator } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminCreatorsPage() {
  const { toast } = useToast();
  const [creators, setCreators] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCreator, setCurrentCreator] = useState({
    id: null,
    name: '',
    image_url: '',
    description: '',
  });

  const fetchCreators = async () => {
    try {
      const data = await getAdminCreators();
      setCreators(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load creators." });
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleOpenDialog = (creator = null) => {
    if (creator) {
      setIsEditing(true);
      setCurrentCreator(creator);
    } else {
      setIsEditing(false);
      setCurrentCreator({ id: null, name: '', image_url: '', description: '' });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveCreator = async () => {
    try {
      if (isEditing) {
        await updateCreator(currentCreator);
        toast({ title: "Success", description: "Creator updated." });
      } else {
        await addCreator(currentCreator);
        toast({ title: "Success", description: "Creator added." });
      }
      fetchCreators();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save creator." });
    }
  };

  const handleDeleteCreator = async (id: number) => {
    try {
      await deleteCreator(id);
      fetchCreators();
      toast({ title: "Success", description: "Creator deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete creator." });
    }
  };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCurrentCreator(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Creators</h1>
        <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Creator</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Creator' : 'Add New Creator'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentCreator.name} onChange={handleInputChange} placeholder="Creator's Name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">Image URL</Label>
              <Input id="image_url" value={currentCreator.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={currentCreator.description} onChange={handleInputChange} placeholder="About the creator..." className="col-span-3" />
            </div>
            <Button onClick={handleSaveCreator}>{isEditing ? 'Save Changes' : 'Save Creator'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator: any) => (
                <TableRow key={creator.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={creator.image_url} alt={creator.name} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{creator.name}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-xs">{creator.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(creator)}><Edit className="w-4 h-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteCreator(creator.id)}><Trash className="w-4 h-4"/></Button>
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
