import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PrepPageHeader = ({ onOpenAddDialog }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prep Items</h1>
      <Button 
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white" 
        onClick={onOpenAddDialog}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Prep Item
      </Button>
    </div>
  );
};

export default PrepPageHeader;