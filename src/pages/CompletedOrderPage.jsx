import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchCompletedOrderDetails } from '@/services/orderService';
import { fetchVendors } from '@/services/inventoryService';
import { Loader2, Printer, ArrowLeft, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const CompletedOrderPage = () => {
  const { orderId } = useParams();
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendorsData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrderDetails = useCallback(async () => {
    if (!userId || !orderId) return;
    setLoading(true);
    try {
      const orderData = await fetchCompletedOrderDetails(supabase, userId, orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching completed order details:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load order details." });
    } finally {
      setLoading(false);
    }
  }, [supabase, userId, orderId, toast]);

  const loadVendors = useCallback(async () => {
    if (!userId) return;
    try {
      const vendorData = await fetchVendors(supabase, userId);
      // Extract unique vendors from order items
      if (order && order.items) {
        const itemVendorIds = new Set(order.items.map(item => item.inventory_items?.vendors?.id).filter(id => id));
        const relevantVendors = vendorData.filter(v => itemVendorIds.has(v.id));
        setVendorsData(relevantVendors);
      } else {
        setVendorsData([]); // Or all vendors if order items not loaded yet
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch vendors." });
    }
  }, [supabase, userId, toast, order]);


  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  useEffect(() => {
    if (order) { // Only load vendors once order data is available
        loadVendors();
    }
  }, [order, loadVendors]);


  const handlePrint = () => {
    window.print();
  };

  const filteredItems = order?.items?.filter(item => {
    const vendorMatch = !selectedVendor || item.inventory_items?.vendors?.id === selectedVendor;
    const searchMatch = !searchTerm || item.inventory_items?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return vendorMatch && searchMatch;
  }) || [];

  const groupedByVendor = filteredItems.reduce((acc, item) => {
    const vendorName = item.inventory_items?.vendors?.name || 'Unknown Vendor';
    if (!acc[vendorName]) {
      acc[vendorName] = [];
    }
    acc[vendorName].push(item);
    return acc;
  }, {});
  
  const sortedVendorNames = Object.keys(groupedByVendor).sort();


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400">Order not found or you do not have permission to view it.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/dashboard/order-list">Go to Order List</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2 sm:mb-0">
            <Link to="/dashboard/order-list">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Order List
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Purchase Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Completed on: {new Date(order.completed_at || order.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={handlePrint} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
          <Printer className="w-4 h-4 mr-2" />
          Print Order
        </Button>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search items in this order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedVendor ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedVendor(null)}
            >
              <Filter className="w-4 h-4 mr-2" /> All Vendors
            </Button>
            {vendors.map(vendor => (
              <Button
                key={vendor.id}
                variant={selectedVendor === vendor.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVendor(prev => prev === vendor.id ? null : vendor.id)}
              >
                {vendor.name}
                {selectedVendor === vendor.id && <X className="w-3 h-3 ml-1.5" />}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="print-container bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <div className="printable-content">
          <div className="text-center mb-8 hidden print:block">
             <h2 className="text-2xl font-bold">Purchase Order #{order.id.slice(0,8)}</h2>
             <p>Date: {new Date(order.completed_at || order.created_at).toLocaleDateString()}</p>
          </div>

          {sortedVendorNames.map(vendorName => (
            <div key={vendorName} className="mb-8 last:mb-0">
              <h2 className="text-xl font-semibold text-primary dark:text-primary-400 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                {vendorName}
              </h2>
              <div className="space-y-3">
                {groupedByVendor[vendorName].map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="col-span-12 sm:col-span-5 font-medium text-gray-800 dark:text-gray-100">{item.inventory_items?.name || 'Unknown Item'}</div>
                    <div className="col-span-4 sm:col-span-2 text-gray-600 dark:text-gray-300">{item.quantity} {item.unit || item.inventory_items?.unit}</div>
                    <div className="col-span-4 sm:col-span-2 text-gray-600 dark:text-gray-300">@ ${parseFloat(item.price_per_unit || 0).toFixed(2)}</div>
                    <div className="col-span-4 sm:col-span-3 text-right font-semibold text-gray-800 dark:text-gray-100">${parseFloat(item.total_price || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
               <div className="text-right mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Vendor Total: </span>
                <span className="text-md font-bold text-gray-800 dark:text-white">
                  ${groupedByVendor[vendorName].reduce((sum, i) => sum + (parseFloat(i.total_price) || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          
          <div className="mt-10 pt-6 border-t-2 border-gray-300 dark:border-gray-600 text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Items: {order.items.length}</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Grand Total: ${parseFloat(order.total_amount || 0).toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          .non-printable {
            display: none !important;
          }
           .print-container .dark\\:bg-gray-800 { background-color: white !important; }
           .print-container .dark\\:text-white { color: black !important; }
           .print-container .dark\\:text-gray-100 { color: black !important; }
           .print-container .dark\\:text-gray-300 { color: #374151 !important; } /* gray-700 */
           .print-container .dark\\:text-gray-400 { color: #6b7280 !important; } /* gray-500 */
           .print-container .dark\\:border-gray-700 { border-color: #e5e7eb !important; } /* gray-200 */
           .print-container .dark\\:border-gray-600 { border-color: #d1d5db !important; } /* gray-300 */
           .print-container .dark\\:bg-gray-700\\/50 { background-color: rgba(243, 244, 246, 0.5) !important; } /* gray-100/50 */
           .print-container .dark\\:text-primary-400 { color: #2563eb !important; } /* primary color */
        }
      `}</style>
    </motion.div>
  );
};

export default CompletedOrderPage;