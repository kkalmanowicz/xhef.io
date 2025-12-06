import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar, Package } from "lucide-react";

function WasteSummaryCards({ summary }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const summaryData = [
    {
      title: "Total Waste Cost",
      value: `$${summary.totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: "text-red-500 dark:text-red-400",
    },
    {
      title: "Weekly Waste Items",
      value: summary.weeklyCount,
      icon: Calendar,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      title: "Total Quantity Wasted",
      value: `${summary.totalQuantity.toFixed(2)} units`,
      icon: Package,
      color: "text-yellow-500 dark:text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaryData.map((item, index) => (
        <motion.div
          key={item.title}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-gray-800 dark:text-white">{item.value}</h2>
            </div>
            <item.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${item.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default WasteSummaryCards;