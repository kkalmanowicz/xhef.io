import React from "react";
import { motion } from "framer-motion";
import OrderHistoryItem from "@/components/orderlist/OrderHistoryItem";
import { Button } from "@/components/ui/button";
import { DollarSign, CalendarDays, RotateCcw } from "lucide-react";

const OrderHistoryCard = ({ order, onReorder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-primary dark:text-primary-400">
            Order #{order.id.slice(0, 8)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
            {new Date(order.completed_at || order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center text-green-600 dark:text-green-400 order-2 sm:order-1 sm:mr-4">
                <DollarSign className="w-5 h-5 mr-1" />
                <span className="text-xl font-semibold">
                    ${parseFloat(order.total_amount || 0).toFixed(2)}
                </span>
            </div>
            {order.order_history && order.order_history.length > 0 && (
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onReorder(order)}
                    className="order-1 sm:order-2 w-full sm:w-auto border-primary text-primary hover:bg-primary/10 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400/10"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Re-order Items
                </Button>
            )}
        </div>
      </div>
      {order.order_history && order.order_history.length > 0 ? (
        <div className="space-y-2">
          {order.order_history.map((item) => (
            <OrderHistoryItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No items in this order.</p>
      )}
    </motion.div>
  );
};

export default OrderHistoryCard;