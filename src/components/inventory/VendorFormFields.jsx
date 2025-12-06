import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const VendorFormFields = ({ vendorData, onFieldChange, isEditing = false }) => {
  const idPrefix = isEditing ? `edit-vendor-${vendorData.id}` : 'new-vendor';
  return (
    <div className="space-y-4 py-2">
      <div>
        <Label htmlFor={`${idPrefix}-name`}>Name <span className="text-red-500">*</span></Label>
        <Input
          id={`${idPrefix}-name`}
          placeholder="Vendor name"
          value={vendorData.name || ''}
          onChange={(e) => onFieldChange("name", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-contact`}>Contact Person</Label>
        <Input
          id={`${idPrefix}-contact`}
          placeholder="Contact person name"
          value={vendorData.contact_person || ''}
          onChange={(e) => onFieldChange("contact_person", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="Contact email"
          value={vendorData.email || ''}
          onChange={(e) => onFieldChange("email", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-phone`}>Phone</Label>
        <Input
          id={`${idPrefix}-phone`}
          placeholder="Contact phone"
          value={vendorData.phone || ''}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default VendorFormFields;