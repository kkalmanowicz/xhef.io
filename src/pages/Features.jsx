import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Package,
  Scale,
  Boxes,
  Brain,
  BarChart2,
  Building2,
  Shield,
  CheckCircle2
} from "lucide-react";

function Features() {
  const coreFeatures = [
    {
      icon: Package,
      title: "Smart Inventory Tracking",
      description: "Log ingredients with units, vendors, categories, and par levels. Get low-stock alerts and automated reorder suggestions.",
      benefits: [
        "Track inventory across multiple locations",
        "Set automatic reorder points",
        "Monitor vendor pricing and availability",
        "Reduce food waste with expiration tracking"
      ]
    },
    {
      icon: Scale,
      title: "Advanced Prep Management",
      description: "Create reusable prep items like sauces, stocks, and grains. Automatically deduct raw inventory when prep items are made.",
      benefits: [
        "Build prep recipes with automatic costing",
        "Track prep item shelf life and usage",
        "Schedule prep tasks by station and shift",
        "Monitor prep efficiency and labor costs"
      ]
    },
    {
      icon: Boxes,
      title: "Dynamic Recipe Scaling",
      description: "Build recipes that pull from prep items or raw inventory. Auto-calculate portions based on covers or event size.",
      benefits: [
        "Scale recipes for any event size",
        "Automatic ingredient calculations",
        "Cost analysis per portion",
        "Nutritional information tracking"
      ]
    }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Suggestions",
      description: "AI analyzes your kitchen patterns to provide intelligent recommendations on prep schedules, ordering, and waste reduction.",
      benefits: [
        "Predictive ordering based on historical data",
        "Optimal prep scheduling recommendations",
        "Waste reduction strategies",
        "Menu optimization insights"
      ]
    },
    {
      icon: BarChart2,
      title: "Performance Analytics",
      description: "Track key metrics like food costs, waste percentages, and prep efficiency across your entire operation.",
      benefits: [
        "Real-time cost tracking",
        "Waste pattern analysis",
        "Staff productivity insights",
        "Profit margin optimization"
      ]
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Building2,
      title: "Unified Dashboard",
      description: "Manage multiple locations from a single dashboard with shared inventory pools and centralized reporting.",
      benefits: [
        "Cross-location inventory transfers",
        "Standardized recipes across sites",
        "Consolidated vendor management",
        "Corporate-level reporting"
      ]
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Control who can access what information with granular permissions for different staff levels.",
      benefits: [
        "Manager, chef, and staff access levels",
        "Location-specific permissions",
        "Audit trails for all changes",
        "Secure data protection"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Features That Work
                <span className="text-primary"> As Hard As You Do</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Comprehensive kitchen management tools designed for modern food service operations.
                From inventory tracking to AI-powered suggestions, xhef.io provides everything you need to run your kitchen like a pro.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Kitchen Management */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Core Kitchen Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI-Powered Intelligence */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">AI-Powered Intelligence</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Location Management */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Multi-Location Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {enterpriseFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Kitchen Operations?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of kitchens already using xhef.io to streamline their operations and reduce costs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Join Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Features;