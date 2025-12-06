import React from 'react';
import { Button } from '@/components/ui/button';
import { ListFilter, X, Loader2 } from 'lucide-react';

const FilterButtonGroup = ({ title, items, selectedItem, onSelectItem, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading {title.toLowerCase()}...</span>
      </div>
    );
  }

  const handleSelect = (itemId) => {
    if (typeof onSelectItem === 'function') {
      onSelectItem(prev => prev === itemId ? null : itemId);
    } else {
      console.error(`onSelectItem is not a function for ${title}`);
    }
  };

  const handleSelectAll = () => {
    if (typeof onSelectItem === 'function') {
      onSelectItem(null);
    } else {
      console.error(`onSelectItem is not a function for ${title} (select all)`);
    }
  };


  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{title}:</h3>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={!selectedItem ? "default" : "outline"}
          size="sm"
          onClick={handleSelectAll}
          className={`transition-all duration-150 ${!selectedItem ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <ListFilter className="w-4 h-4 mr-2" />
          All {title}
        </Button>
        {items.map((item) => (
          <Button
            key={item.id}
            variant={selectedItem === item.id ? "default" : "outline"}
            onClick={() => handleSelect(item.id)}
            size="sm"
            className={`transition-all duration-150 ${selectedItem === item.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {item.name}
            {selectedItem === item.id && <X className="w-3 h-3 ml-2" />}
          </Button>
        ))}
      </div>
    </div>
  );
};


const OrderListFilterControls = ({
  vendors,
  selectedVendor,
  onSelectedVendorChange,
  categories,
  selectedCategory,
  onSelectedCategoryChange,
  isLoadingVendors,
  isLoadingCategories,
}) => {
  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow">
       <FilterButtonGroup
        title="Vendors"
        items={vendors}
        selectedItem={selectedVendor}
        onSelectItem={onSelectedVendorChange}
        isLoading={isLoadingVendors}
      />
      <FilterButtonGroup
        title="Categories"
        items={categories}
        selectedItem={selectedCategory}
        onSelectItem={onSelectedCategoryChange}
        isLoading={isLoadingCategories}
      />
    </div>
  );
};

export default OrderListFilterControls;