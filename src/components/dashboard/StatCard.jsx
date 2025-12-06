import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, color, link, delay }) => (
  <Link to={link}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>
        {Icon && <Icon className={`w-8 h-8 ${color}`} />}
      </div>
    </motion.div>
  </Link>
);

export default StatCard;