import { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from "@/components/ui/use-toast";
import { bulkInsertInventoryItems } from '@/services/inventoryService'; 
import useCsvParser from '@/hooks/useCsvParser';

const useBulkUploadHandler = (categories, vendors, onUploadSuccess, handleDialogClose) => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const { parseCSV } = useCsvParser();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);

  const handleUpload = async (files) => {
    if (files.length === 0) {
      toast({ variant: "destructive", title: "No file selected", description: "Please select a CSV file to upload." });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults(null);
    const file = files[0];

    try {
      const parsedData = await parseCSV(file);
      if (!parsedData || parsedData.length === 0) {
        toast({ variant: "destructive", title: "Empty CSV", description: "The CSV file is empty or improperly formatted." });
        setUploadResults({ successCount: 0, errors: [{row: "File", message: "CSV file is empty or improperly formatted."}] });
        setIsUploading(false);
        return;
      }
      
      // Simulate progress for parsing (could be more granular if needed)
      setUploadProgress(10);

      const { successCount, errors } = await bulkInsertInventoryItems(supabase, userId, parsedData, categories, vendors);
      
      // Simulate final progress
      setUploadProgress(100); 
      setUploadResults({ successCount, errors });

      if (errors.length === 0 && successCount > 0) {
        toast({ title: "Upload Successful", description: `${successCount} items uploaded successfully.` });
        if (onUploadSuccess) onUploadSuccess();
        if (handleDialogClose) handleDialogClose(); 
      } else if (successCount > 0) {
         toast({ variant: "default", title: "Partial Success", description: `${successCount} items uploaded. Some items had errors. See results for details.` });
      } else if (errors.length > 0) {
        toast({ variant: "destructive", title: "Upload Failed", description: "Please check the errors in the results panel." });
      } else {
         toast({ variant: "default", title: "No Items Processed", description: "No items were uploaded. The file might be empty or all rows had errors." });
      }

    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "Upload Error", description: error.message || "An unexpected error occurred." });
      setUploadResults({ successCount: 0, errors: [{ row: 'File', message: error.message }] });
    } finally {
      setIsUploading(false);
      // Progress is set to 100 in try or remains 0 if initial parsing fails quickly.
      // If you want to reset progress visually after errors, you could set it to 0 here
      // but it might be better to keep it at 100 to show completion of the attempt.
    }
  };
  
  const resetUploadState = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadResults(null);
  };

  return {
    isUploading,
    uploadProgress,
    uploadResults,
    handleUpload,
    resetUploadState,
    setUploadResults // Expose for direct manipulation if needed (e.g., clearing results)
  };
};

export default useBulkUploadHandler;