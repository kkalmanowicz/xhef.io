import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import VendorFormFields from "@/components/inventory/VendorFormFields";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save, Loader2 } from "lucide-react";

const VendorFormDialog = ({ isOpen, onClose, onSubmit, vendorData: initialVendorData, isEditing, isSubmitting }) => {
  const [currentVendorData, setCurrentVendorData] = useState(initialVendorData);

  useEffect(() => {
    setCurrentVendorData(initialVendorData);
  }, [initialVendorData]);

  const handleFieldChange = (field, value) => {
    setCurrentVendorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentVendorData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isEditing ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <VendorFormFields vendorData={currentVendorData} onFieldChange={handleFieldChange} isEditing={isEditing} />
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Saving..." : (isEditing ? "Save Changes" : "Add Vendor")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorFormDialog;