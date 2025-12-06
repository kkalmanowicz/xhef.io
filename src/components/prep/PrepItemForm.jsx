import React from "react";
import { Button } from "@/components/ui/button";
import PrepItemIngredientsForm from "@/components/prep/PrepItemIngredientsForm";
import PrepItemBasicInfoFields from "@/components/prep/PrepItemBasicInfoFields";
import PrepItemNotesField from "@/components/prep/PrepItemNotesField";
import usePrepItemForm from "@/hooks/usePrepItemForm";
import { Loader2 } from "lucide-react";

function PrepItemForm({ existingItem, onSuccess, onCancel }) {
  const {
    formData,
    inventoryItems,
    isLoading,
    handleFormChange,
    handleAddIngredient,
    handleRemoveIngredient,
    handleIngredientChange,
    handleSubmit
  } = usePrepItemForm(existingItem);

  const triggerSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={triggerSubmit} className="space-y-6">
      <PrepItemBasicInfoFields 
        formData={formData} 
        onFormChange={handleFormChange} 
      />
      
      <PrepItemNotesField 
        notes={formData.notes}
        onNotesChange={(value) => handleFormChange('notes', value)}
      />

      <PrepItemIngredientsForm
        ingredients={formData.ingredients}
        inventoryItems={inventoryItems}
        onIngredientChange={handleIngredientChange}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : (existingItem?.id ? "Update Item" : "Create Item")}
        </Button>
      </div>
    </form>
  );
}

export default PrepItemForm;