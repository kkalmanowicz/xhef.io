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

const InventoryFormFields = ({ formData, setFormData, errors, setErrors, categories, vendors, isEditMode = false }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNumericInputChange = (field, value) => {
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    }
  };
  
  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
     if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };


  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Item Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={errors.name ? "border-red-500" : ""}
          placeholder="e.g., Roma Tomatoes"
        />
        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
      </div>

      <div>
        <Label htmlFor="sku">SKU (Vendor Code)</Label>
        <Input
          id="sku"
          value={formData.sku || ""}
          onChange={(e) => handleInputChange('sku', e.target.value)}
          placeholder="e.g., VN-12345"
        />
        {errors.sku && <span className="text-sm text-red-500">{errors.sku}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="current_stock">Current Stock <span className="text-red-500">*</span></Label>
          <Input
            id="current_stock"
            type="text" 
            inputMode="decimal"
            value={formData.current_stock}
            onChange={(e) => handleNumericInputChange('current_stock', e.target.value)}
            className={errors.current_stock ? "border-red-500" : ""}
            placeholder="e.g., 10.5"
          />
          {errors.current_stock && <span className="text-sm text-red-500">{errors.current_stock}</span>}
        </div>
        <div>
          <Label htmlFor="par_level">Par Level <span className="text-red-500">*</span></Label>
          <Input
            id="par_level"
            type="text"
            inputMode="decimal"
            value={formData.par_level}
            onChange={(e) => handleNumericInputChange('par_level', e.target.value)}
            className={errors.par_level ? "border-red-500" : ""}
            placeholder="e.g., 5"
          />
          {errors.par_level && <span className="text-sm text-red-500">{errors.par_level}</span>}
        </div>
      </div>

      <div>
        <Label htmlFor="unit">Unit <span className="text-red-500">*</span></Label>
        <UnitSelector
          value={formData.unit}
          onValueChange={(value) => handleSelectChange('unit', value)}
          className={errors.unit ? "border-red-500" : ""}
        />
        {errors.unit && <span className="text-sm text-red-500">{errors.unit}</span>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="default_price">Default Price (per {formData.unit || 'unit'})</Label>
          <Input
            id="default_price"
            type="text"
            inputMode="decimal"
            value={formData.default_price}
            onChange={(e) => handleNumericInputChange('default_price', e.target.value)}
            className={errors.default_price ? "border-red-500" : ""}
            placeholder="0.00"
          />
          {errors.default_price && <span className="text-sm text-red-500">{errors.default_price}</span>}
        </div>
        <div>
          <Label htmlFor="last_price">Last Purchase Price (per {formData.unit || 'unit'})</Label>
          <Input
            id="last_price"
            type="text"
            inputMode="decimal"
            value={formData.last_price}
            onChange={(e) => handleNumericInputChange('last_price', e.target.value)}
            placeholder="0.00"
          />
           {errors.last_price && <span className="text-sm text-red-500">{errors.last_price}</span>}
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
        <Select value={formData.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
          <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && <span className="text-sm text-red-500">{errors.category_id}</span>}
      </div>

      <div>
        <Label htmlFor="vendor">Vendor (Optional)</Label>
        <Select value={formData.vendor_id || ""} onValueChange={(value) => handleSelectChange('vendor_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select vendor (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InventoryFormFields;