// src/app/admin/categories/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminCategories, addCategory, updateCategory, deleteCategory } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });

  const fetchCategories = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load categories." });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
    } else {
      setIsEditing(false);
      setCurrentCategory({ id: null, name: '' });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveCategory = async () => {
    try {
      if (isEditing) {
        await updateCategory(currentCategory);
        toast({ title: "Success", description: "Category updated." });
      } else {
        await addCategory(currentCategory);
        toast({ title: "Success", description: "Category added." });
      }
      fetchCategories();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save category." });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      toast({ title: "Success", description: "Category deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete category." });
    }
  };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Category</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentCategory.name} onChange={handleInputChange} placeholder="Category Name" className="col-span-3" />
            </div>
            <Button onClick={handleSaveCategory}>{isEditing ? 'Save Changes' : 'Save Category'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(category)}><Edit className="w-4 h-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteCategory(category.id)}><Trash className="w-4 h-4"/></Button>
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
