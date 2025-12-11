import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Clock,
  Target,
  Users,
  Calculator,
  CheckCircle2,
  PlayCircle
} from "lucide-react";

function Demo() {
  const benefits = [
    {
      icon: Clock,
      title: "Quick 30-Minute Session",
      description: "We respect your busy schedule. Our demos are focused and efficient."
    },
    {
      icon: Target,
      title: "Tailored to Your Needs",
      description: "We'll customize the demo based on your specific operation type and challenges."
    },
    {
      icon: Users,
      title: "Bring Your Team",
      description: "Include key staff members to see how each role benefits from xhef.io."
    },
    {
      icon: Calculator,
      title: "ROI Analysis",
      description: "We'll show you potential savings and efficiency gains for your specific operation."
    }
  ];

  const demoTypes = [
    {
      title: "Restaurant Demo",
      duration: "30 minutes",
      description: "Perfect for single or multi-location restaurants",
      includes: [
        "Inventory management walkthrough",
        "Prep scheduling and tracking",
        "Recipe scaling for different service sizes",
        "Cost analysis and reporting",
        "Staff workflow optimization"
      ]
    },
    {
      title: "Catering Demo",
      duration: "30 minutes",
      description: "Specialized for catering and event operations",
      includes: [
        "Event-based planning and scaling",
        "Large batch recipe management",
        "Mobile inventory tracking",
        "Client-specific reporting",
        "Equipment and supply planning"
      ]
    },
    {
      title: "Enterprise Demo",
      duration: "45 minutes",
      description: "Comprehensive demo for large operations",
      includes: [
        "Multi-location management",
        "Corporate reporting and analytics",
        "Integration capabilities",
        "Custom workflow setup",
        "Implementation planning"
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
                See Xhef.io
                <span className="text-primary"> in Action</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Get a personalized demo tailored to your kitchen's needs.
                Book a 30-minute demo with our team to see exactly how xhef.io can transform your kitchen operations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Types */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Choose Your Demo</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {demoTypes.map((demo, index) => (
                <motion.div
                  key={demo.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {demo.title}
                    </h3>
                    <p className="text-primary font-medium">{demo.duration}</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {demo.description}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {demo.includes.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Request Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Schedule Your Demo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll contact you within 24 hours to schedule your personalized demo.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <form action="https://formspree.io/f/your-demo-form-id" method="POST" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
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
                      Last Name *
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Restaurant/Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="operationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Operation Type *
                    </label>
                    <select
                      id="operationType"
                      name="operationType"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select operation type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="catering">Catering</option>
                      <option value="multi-location">Multi-Location Chain</option>
                      <option value="ghost-kitchen">Ghost Kitchen</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="locations" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Locations *
                    </label>
                    <select
                      id="locations"
                      name="locations"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select locations</option>
                      <option value="1">1</option>
                      <option value="2-3">2-3</option>
                      <option value="4-10">4-10</option>
                      <option value="11-25">11-25</option>
                      <option value="25+">25+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Demo Time *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-5PM)</option>
                    <option value="evening">Evening (5PM-8PM)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Biggest Kitchen Management Challenges (Optional)
                  </label>
                  <textarea
                    id="challenges"
                    name="challenges"
                    rows={4}
                    placeholder="Tell us about your current challenges so we can customize the demo..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Schedule My Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                We'll contact you within 24 hours to schedule your demo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Can't Wait for a Demo?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start your free trial today and explore xhef.io at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Join Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                Call Us: (555) 123-4567
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Demo;