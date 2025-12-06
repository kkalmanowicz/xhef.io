import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, X, Loader2 } from 'lucide-react';

const InventoryFilterControls = ({
  searchTerm,
  onSearchTermChange,
  categories,
  selectedCategory,
  onSelectedCategoryChange,
  vendors,
  selectedVendor,
  onSelectedVendorChange,
  isLoading,
}) => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
        <Input
          placeholder="Search inventory by name..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-12 text-base py-3 rounded-lg border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
          Filter by Category:
          {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-primary" />}
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectedCategoryChange(null)}
            disabled={isLoading}
            className={`transition-all duration-150 ${!selectedCategory ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <ListFilter className="w-4 h-4 mr-2" />
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onSelectedCategoryChange(prev => prev === category.id ? null : category.id)}
              size="sm"
              disabled={isLoading}
              className={`transition-all duration-150 ${selectedCategory === category.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {category.name}
              {selectedCategory === category.id && <X className="w-3 h-3 ml-2" />}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
          Filter by Vendor:
          {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin text-primary" />}
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant={!selectedVendor ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectedVendorChange(null)}
            disabled={isLoading}
            className={`transition-all duration-150 ${!selectedVendor ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <ListFilter className="w-4 h-4 mr-2" />
            All Vendors
          </Button>
          {vendors.map((vendor) => (
            <Button
              key={vendor.id}
              variant={selectedVendor === vendor.id ? "default" : "outline"}
              onClick={() => onSelectedVendorChange(prev => prev === vendor.id ? null : vendor.id)}
              size="sm"
              disabled={isLoading}
              className={`transition-all duration-150 ${selectedVendor === vendor.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {vendor.name}
              {selectedVendor === vendor.id && <X className="w-3 h-3 ml-2" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryFilterControls;