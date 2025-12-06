import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import FileUploadArea from '@/components/inventory/FileUploadArea';
import UploadResultsDisplay from '@/components/inventory/UploadResultsDisplay';
import ProgressIndicator from '@/components/inventory/ProgressIndicator';
import useBulkUploadHandler from '@/hooks/useBulkUploadHandler';

const BulkUploadDialog = ({ isOpen, onClose, onUploadSuccess, categories, vendors }) => {
  const [files, setFiles] = useState([]);
  
  const handleDialogClose = () => {
    setFiles([]);
    resetUploadState();
    onClose();
  };
  
  const { 
    isUploading, 
    uploadProgress, 
    uploadResults, 
    handleUpload,
    resetUploadState,
    setUploadResults
  } = useBulkUploadHandler(categories, vendors, onUploadSuccess, handleDialogClose);


  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    if (uploadResults) setUploadResults(null); 
  }, [uploadResults, setUploadResults]);
  
  const downloadTemplate = () => {
    const headers = "Item Name,SKU,Current Stock,Par Level,Unit,Category,Vendor,Default Price,Last Price";
    const exampleRow1 = "Tomatoes,TOM001,10,5,kg,Vegetables,Fresh Produce Inc.,2.50,2.45";
    const exampleRow2 = "Chicken Breast,CHK002,20,10,kg,Meat,Poultry Farm,8.00,7.90";
    const exampleRow3 = "Milk,MLK003,12,6,l,Dairy,Farm Fresh Dairy,,3.00";
    const exampleRow4 = "Energy Drink,ED004,24,12,units,Beverages,Bev Co,1.50,1.45"; 
    const csvContent = "data:text/csv;charset=utf-8," + [headers, exampleRow1, exampleRow2, exampleRow3, exampleRow4].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_template_with_sku_and_units_example.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metricUnits = ["kg", "g", "l", "ml", "units", "pieces"];
  const imperialUnits = ["lb", "oz", "gal", "qt", "fl_oz"];
  const allUnits = [...metricUnits, ...imperialUnits];


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleDialogClose(); }}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">Bulk Upload Inventory</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Upload a CSV file to add multiple inventory items. 
            The CSV header for units should be "Unit".
            Required headers: Item Name, Unit, Category. 
            Optional headers: SKU, Current Stock, Par Level, Vendor, Default Price, Last Price.
            <br />
            Default Price should be a number (e.g., 2.50). 
            Accepted values for the "Unit" column are: {allUnits.join(", ")}. For generic countable items, use "units".
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <FileUploadArea onDrop={onDrop} files={files} />
          
          <div className="text-center">
            <Button variant="link" onClick={downloadTemplate} className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Download CSV Template
            </Button>
          </div>

          {isUploading && <ProgressIndicator progress={uploadProgress} />}
          <UploadResultsDisplay results={uploadResults} />
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleDialogClose} disabled={isUploading}>
            {uploadResults ? 'Close' : 'Cancel'}
          </Button>
          <Button 
            onClick={() => handleUpload(files)} 
            disabled={isUploading || files.length === 0}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;