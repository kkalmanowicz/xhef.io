import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UnitSelector from "@/components/inventory/UnitSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stations = ["grill", "saute", "sauces", "salads", "events", "other"];

const PrepItemBasicInfoFields = ({ formData, onFormChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            required
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <Label htmlFor="station">Station</Label>
          <Select
            value={formData.station}
            onValueChange={(value) => onFormChange('station', value)}
          >
            <SelectTrigger id="station" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="current_stock">Current Stock</Label>
          <Input
            id="current_stock"
            type="number"
            min="0"
            step="0.01"
            value={formData.current_stock}
            onChange={(e) => onFormChange('current_stock', e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <Label htmlFor="par_level">Par Level</Label>
          <Input
            id="par_level"
            type="number"
            min="0"
            step="0.01"
            value={formData.par_level}
            onChange={(e) => onFormChange('par_level', e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <Label htmlFor="yield_unit">Yield Unit</Label>
          <UnitSelector
            id="yield_unit"
            value={formData.yield_unit}
            onValueChange={(value) => onFormChange('yield_unit', value)}
            triggerClassName="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
    </>
  );
};

export default PrepItemBasicInfoFields;