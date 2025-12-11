import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, Clock } from "lucide-react";

function Blog() {
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
                Kitchen Management
                <span className="text-primary"> Insights</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Expert tips, industry insights, and best practices for modern restaurant operations.
                Our blog is coming soon with valuable content from industry professionals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Blog Coming Soon
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                We're preparing valuable content about kitchen management, inventory optimization,
                cost control, and industry trends. Stay tuned for expert insights and practical tips.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Industry Insights</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Trends and analysis from restaurant professionals
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Best Practices</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Proven strategies for kitchen optimization
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">How-To Guides</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Step-by-step tutorials and implementation tips
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-primary mb-4">Get Notified When We Launch</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Be the first to read our expert insights on kitchen management and restaurant operations.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  />
                  <Button>
                    Notify Me
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8">
                    Join Early Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Schedule Demo
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

export default Blog;