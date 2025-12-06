import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Plus, Loader2 } from "lucide-react";
import VendorCard from "@/components/inventory/VendorCard";
import VendorFormDialog from "@/components/inventory/VendorFormDialog";
import VendorDeleteDialog from "@/components/inventory/VendorDeleteDialog";
import { fetchVendors, addVendor, updateVendor, deleteVendorById } from "@/services/vendorService";

const initialVendorData = { name: "", contact_person: "", email: "", phone: "" };

function VendorManager({ vendors: initialVendors, onVendorsChange }) {
  const [vendorsList, setVendorsList] = useState(initialVendors || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  
  const [vendorToEdit, setVendorToEdit] = useState(null);
  const [vendorToDelete, setVendorToDelete] = useState(null);
    
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadLocalVendors = useCallback(async () => {
    if (!userId || initialVendors) return; 
    if (!isMounted.current) return;
    setIsLoading(true);
    try {
      const data = await fetchVendors(supabase, userId);
      if (isMounted.current) setVendorsList(data);
    } catch (error) {
      if (isMounted.current) toast({ variant: "destructive", title: "Error", description: "Failed to load vendors."});
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [supabase, userId, toast, initialVendors]);

  useEffect(() => {
    loadLocalVendors();
  }, [loadLocalVendors]);

  useEffect(() => {
    if (isMounted.current) setVendorsList(initialVendors || []);
  }, [initialVendors]);
  
  useEffect(() => {
    if (!userId || !supabase) return;
    const channelName = `public:vendors_manager_vm_${userId}_${Date.now()}`;
    const vendorsChannel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log("Vendor manager received realtime update", payload);
          if (onVendorsChange) {
            // Parent is responsible for fetching/updating its list
            // This component will receive new `initialVendors` prop if parent updates
          } else {
            if (isMounted.current) loadLocalVendors();
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') console.log(`Subscribed to ${channelName}`);
        if (err) console.error(`Error subscribing to ${channelName}`, err);
      });
    return () => {
      if (supabase && vendorsChannel) {
        supabase.removeChannel(vendorsChannel).catch(e => console.error("Error removing vendor channel", e));
      }
    };
  }, [supabase, userId, loadLocalVendors, onVendorsChange]);


  const validateVendor = (vendor) => {
    if (!vendor.name?.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Vendor name is required" });
      return false;
    }
    if (vendor.email && !/^\S+@\S+\.\S+$/.test(vendor.email)) {
      toast({ variant: "destructive", title: "Error", description: "Invalid email format" });
      return false;
    }
    return true;
  };

  const openAddDialog = () => {
    setVendorToEdit(null);
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (vendor) => {
    setVendorToEdit(vendor);
    setIsFormDialogOpen(true);
  };

  const handleSaveVendor = async (vendorData) => {
    if (!validateVendor(vendorData)) return;
    if (!isMounted.current) return;
    setIsSubmitting(true);
    try {
      let updatedVendors;
      if (vendorToEdit) { 
        const updatedVendor = await updateVendor(supabase, vendorToEdit.id, userId, vendorData);
        updatedVendors = vendorsList.map(v => v.id === updatedVendor.id ? updatedVendor : v);
        toast({ title: "Success", description: "Vendor updated successfully" });
      } else { 
        const newVendor = await addVendor(supabase, userId, vendorData);
        updatedVendors = [...vendorsList, newVendor];
        toast({ title: "Success", description: "Vendor added successfully" });
      }
      if (isMounted.current) {
        setVendorsList(updatedVendors);
        if(onVendorsChange) onVendorsChange(updatedVendors);
        setIsFormDialogOpen(false);
      }
    } catch (error) {
      if (isMounted.current) toast({ variant: "destructive", title: "Error", description: error.message || "Failed to save vendor" });
    } finally {
      if (isMounted.current) setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (vendor) => {
    setVendorToDelete(vendor);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!vendorToDelete || !isMounted.current) return;
    setIsSubmitting(true);
    try {
      await deleteVendorById(supabase, vendorToDelete.id, userId);
      const updatedVendors = vendorsList.filter(v => v.id !== vendorToDelete.id);
      if (isMounted.current) {
        setVendorsList(updatedVendors);
        if(onVendorsChange) onVendorsChange(updatedVendors);
        toast({ title: "Success", description: "Vendor deleted successfully" });
      }
    } catch (error) {
      if (isMounted.current) toast({ variant: "destructive", title: "Error", description: error.message || "Failed to delete vendor." });
    } finally {
      if (isMounted.current) {
        setIsConfirmDeleteDialogOpen(false);
        setVendorToDelete(null);
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading && !initialVendors) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Vendors</h2>
        <Button onClick={openAddDialog} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add Vendor
        </Button>
      </div>

      {vendorsList.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No vendors added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendorsList.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onEdit={() => openEditDialog(vendor)} onDelete={() => openDeleteDialog(vendor)} />
          ))}
        </div>
      )}

      <VendorFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleSaveVendor}
        vendorData={vendorToEdit || initialVendorData}
        isEditing={!!vendorToEdit}
        isSubmitting={isSubmitting}
      />
      
      <VendorDeleteDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirmed}
        vendorName={vendorToDelete?.name}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default VendorManager;