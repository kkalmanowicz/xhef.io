import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PrepItemNotesField = ({ notes, onNotesChange }) => {
  return (
    <div>
      <Label htmlFor="notes">Notes</Label>
      <Input
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Optional notes about the prep item..."
        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
};

export default PrepItemNotesField;