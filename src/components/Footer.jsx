import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-primary">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary">Pricing</Link></li>
              <li><Link to="/demo" className="text-gray-600 dark:text-gray-300 hover:text-primary">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary">About</Link></li>
              <li><Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-gray-600 dark:text-gray-300 hover:text-primary">Documentation</Link></li>
              <li><Link to="/help" className="text-gray-600 dark:text-gray-300 hover:text-primary">Help Center</Link></li>
              <li><Link to="/guides" className="text-gray-600 dark:text-gray-300 hover:text-primary">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary">Terms</Link></li>
              <li><Link to="/security" className="text-gray-600 dark:text-gray-300 hover:text-primary">Security</Link></li>
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
  );
}

export default Footer;