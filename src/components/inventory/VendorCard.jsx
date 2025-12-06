import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

const VendorCard = ({ vendor, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-primary dark:text-primary-400">{vendor.name}</h3>
        <div className="flex space-x-1">
          <Button size="icon" variant="ghost" onClick={() => onEdit(vendor)} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
            <Edit2 className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(vendor)} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {vendor.contact_person && <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Contact:</strong> {vendor.contact_person}</p>}
      {vendor.email && <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Email:</strong> {vendor.email}</p>}
      {vendor.phone && <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Phone:</strong> {vendor.phone}</p>}
    </div>
  </motion.div>
);

export default VendorCard;