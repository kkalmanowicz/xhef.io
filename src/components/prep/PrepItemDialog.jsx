import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrepItemForm from "@/components/prep/PrepItemForm";

const PrepItemDialog = ({ isOpen, onClose, editingItem, onSuccess }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            {editingItem ? 'Edit Prep Item' : 'Add New Prep Item'}
          </DialogTitle>
        </DialogHeader>
        <PrepItemForm
          existingItem={editingItem}
          onSuccess={() => {
            onSuccess(); 
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PrepItemDialog;