import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const DashboardSection = ({ title, link, children, actionText = "View All" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {link && (
        <Link to={link}>
          <Button variant="ghost" size="sm">
            {actionText}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      )}
    </div>
    {children}
  </motion.div>
);

export default DashboardSection;