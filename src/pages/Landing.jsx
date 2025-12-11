import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  BarChart2,
  Clock,
  Package,
  Shield,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  Boxes,
  Scale,
  Brain,
  Building2
} from "lucide-react";

function Landing() {
  const features = [
    {
      icon: Package,
      title: "Track Inventory",
      description: "Log ingredients with units, vendors, categories, and par levels."
    },
    {
      icon: Scale,
      title: "Prep Like a Pro",
      description: "Create reusable prep items like sauces, stocks, grains, etc., and deduct raw inventory when they're made."
    },
    {
      icon: Boxes,
      title: "Scale Recipes",
      description: "Build recipes that pull from prep items or raw inventory. Auto-calculate based on covers or event size."
    },
    {
      icon: Brain,
      title: "AI-Powered Suggestions",
      description: "Get intelligent prompts on what to prep, when to reorder, and how to reduce waste."
    }
  ];

  const checklistFeatures = [
    "Inventory Tracking",
    "Prep Item Management",
    "Smart Order Lists",
    "Recipe Scaling",
    "Event Planning Mode",
    "Multi-Location Dashboard",
    "Waste & Spoilage Tracking",
    "AI Assistant (Pro +)"
  ];

  const plans = [
    {
      name: "Basic",
      price: "49.95",
      features: ["1 location", "2 users", "Inventory + prep tracking"]
    },
    {
      name: "Pro",
      price: "99.95",
      features: ["1 location", "5 users", "AI suggestions", "Recipe scaling", "Event mode"]
    },
    {
      name: "Team",
      price: "199.95",
      features: ["3 locations", "10 users", "Shared inventory pools", "Multi-location dashboard"]
    },
    {
      name: "Enterprise",
      price: "499.95",
      features: ["Unlimited everything", "Onboarding", "API integrations", "Custom support"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                🧑‍🍳 Run Your Kitchen
                <span className="text-primary"> Like a Pro</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                AI-powered kitchen management for restaurants, caterers, and multi-location teams.
                Track inventory. Manage prep. Plan events. Save time.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Join Early Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Request Demo
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* How It Works */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-12">📋 How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                  >
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-12">⚙️ Features That Work As Hard As You Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {checklistFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lead Capture Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-4">🚀 Join the Kitchen Revolution</h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
                Be among the first to experience AI-powered kitchen management. Get early access and special launch pricing.
              </p>
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <form action="https://formspree.io/f/your-form-id" method="POST" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Restaurant/Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="operationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Operation Type
                    </label>
                    <select
                      id="operationType"
                      name="operationType"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select your operation type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="catering">Catering</option>
                      <option value="multi-location">Multi-Location Chain</option>
                      <option value="ghost-kitchen">Ghost Kitchen</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="updates"
                      name="updates"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="updates" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Send me updates about xhef.io and kitchen management tips
                    </label>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Get Early Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-bold mb-4">📣 Ready to Transform Your Kitchen?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the waiting list for early access to xhef.io. Be the first to experience the future of kitchen management.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8">
                    Join Early Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Request Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;