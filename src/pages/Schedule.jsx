import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

function Schedule() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Schedule
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
      >
        <CalendarDays className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-gray-500">
          The scheduling features are under construction. Check back soon for
          updates!
        </p>
      </motion.div>
    </div>
  );
}

export default Schedule;
