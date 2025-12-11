import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  ChefHat,
  ArrowRight,
  Target,
  Users,
  Heart,
  Lightbulb,
} from 'lucide-react';

function About() {
  const values = [
    {
      icon: ChefHat,
      title: 'Kitchen-First Design',
      description:
        'Every feature is designed by people who understand the fast-paced, high-pressure environment of professional kitchens.',
    },
    {
      icon: Lightbulb,
      title: 'Intelligent Automation',
      description:
        'We believe technology should handle the mundane so chefs can focus on creativity and quality.',
    },
    {
      icon: Heart,
      title: 'Sustainable Operations',
      description:
        "Reducing food waste isn't just good business—it's essential for our planet's future.",
    },
    {
      icon: Target,
      title: 'Continuous Innovation',
      description:
        "We're constantly evolving our platform based on real feedback from real kitchens.",
    },
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
                Built by Chefs,
                <span className="text-primary"> for Chefs</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                We understand the chaos of professional kitchens because we've
                lived it. Xhef.io was born from the frustration of managing
                inventory on spreadsheets and the dream of AI-powered kitchen
                intelligence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto space-y-6 text-gray-600 dark:text-gray-300">
              <p className="text-lg">
                Founded in 2024 by a team of former restaurant professionals and
                tech innovators, xhef.io emerged from a simple observation:
                kitchens are the heart of the food industry, yet they're often
                managed with outdated tools and inefficient processes.
              </p>
              <p className="text-lg">
                After years of watching talented chefs struggle with inventory
                nightmares, prep scheduling chaos, and wasteful practices, we
                decided to build the solution we wished we'd had in our own
                kitchen careers.
              </p>
              <p className="text-lg">
                Today, xhef.io combines cutting-edge AI with practical kitchen
                wisdom to help food service professionals focus on what they do
                best: creating amazing food experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                To empower food service professionals with intelligent tools
                that reduce waste, improve efficiency, and enhance profitability
                while preserving the craft and creativity of cooking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Status Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Currently in Development
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Xhef.io is currently in active development. We're building the
                future of kitchen management with input from industry
                professionals and potential users like you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Research Phase
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Gathering feedback from restaurant professionals
                  </p>
                </div>
                <div>
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    MVP Development
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Building core features based on real kitchen needs
                  </p>
                </div>
                <div>
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Beta Testing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Soon to launch with select kitchen partners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Become part of the growing community of food service professionals
              who choose intelligent kitchen management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8">
                  Join Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Meet the Team
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

export default About;
