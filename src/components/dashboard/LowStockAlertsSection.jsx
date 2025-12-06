import React from 'react';
import DashboardSection from './DashboardSection';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDashboardActions } from '@/hooks/useDashboardActions';

const LowStockAlertsSection = ({ lowStockItems, onItemAddedToOrder }) => {
  const { handleAddToOrderFromDashboard } = useDashboardActions();

  const handleAddClick = async (item) => {
    const success = await handleAddToOrderFromDashboard(item);
    if (success && onItemAddedToOrder) {
      onItemAddedToOrder(item.id);
    }
  };

  return (
    <DashboardSection title="Low Stock Alerts" link="/dashboard/inventory">
      <div className="space-y-4">
        {lowStockItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">All items are above par level.</p>
        ) : (
          lowStockItems.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current: {item.current_stock} {item.unit} / Par: {item.par_level} {item.unit}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleAddClick(item)}
                >
                  <Plus className="w-4 h-4 mr-2" />Add to Order
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardSection>
  );
};

export default LowStockAlertsSection;