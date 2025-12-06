import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function CategoryManager({ categories, onCategoriesChange }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          name: newCategory,
          user_id: userId,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      onCategoriesChange([...categories, data[0]]);
      setNewCategory("");
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category",
      });
    }
  };

  const handleEditCategory = async (category) => {
    if (!editingCategory.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name cannot be empty",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          name: editingCategory.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id)
        .eq('user_id', userId);

      if (error) throw error;

      onCategoriesChange(
        categories.map((c) => (c.id === category.id ? editingCategory : c))
      );
      setEditingCategory(null);

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category",
      });
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)
        .eq('user_id', userId);

      if (error) throw error;

      onCategoriesChange(categories.filter((c) => c.id !== category.id));

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            {editingCategory?.id === category.id ? (
              <Input
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                className="flex-1 mr-4"
              />
            ) : (
              <span>{category.name}</span>
            )}
            <div className="flex space-x-2">
              {editingCategory?.id === category.id ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoryManager;