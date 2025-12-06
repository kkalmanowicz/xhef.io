import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChefHat, 
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
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Xhef.io</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
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

            {/* Pricing Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-4">💼 Plans & Pricing</h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
                Flexible pricing built for real kitchens.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold mb-4">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-500">/mo</span>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6">
                        Get Started
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center mt-8 space-x-4">
                <Button variant="outline" size="lg">
                  Compare All Plans
                </Button>
                <Button variant="outline" size="lg">
                  Request Demo
                </Button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-bold mb-4">📣 Ready to Cook Smarter?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Start managing your kitchen like a modern chef.
                Try Xhef.io free and see what intelligent kitchen software can do for you.
              </p>
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Privacy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Terms</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Xhef.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;