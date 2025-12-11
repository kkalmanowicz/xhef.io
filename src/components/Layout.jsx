import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ShoppingCart,
  Settings,
  LogOut,
  Book,
  Menu,
  X,
  ListChecks,
  Trash2,
  Calendar,
  CalendarDays,
} from 'lucide-react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/inventory', icon: Package, label: 'Inventory' },
  { to: '/dashboard/prep-items', icon: ListChecks, label: 'Prep Items' },
  { to: '/dashboard/prep-list', icon: ClipboardList, label: 'Prep List' },
  { to: '/dashboard/order-list', icon: ShoppingCart, label: 'Order List' },
  { to: '/dashboard/recipes', icon: Book, label: 'Recipes' },
  { to: '/dashboard/events', icon: Calendar, label: 'Events' },
  { to: '/dashboard/schedule', icon: CalendarDays, label: 'Schedule' },
  { to: '/dashboard/waste', icon: Trash2, label: 'Waste Tracking' },
  { to: '/dashboard/admin', icon: Settings, label: 'Admin Settings' },
];

function Layout() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Logged out successfully',
        description: 'See you next time!',
      });

      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out. Please try again.',
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavLinkClass = (to, exact = false) => {
    const isActive = exact
      ? location.pathname === to
      : location.pathname.startsWith(to);
    // Special case for dashboard: only active if it's exactly /dashboard
    if (to === '/dashboard' && location.pathname !== '/dashboard') {
      return 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
    }
    return cn(
      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-lg z-50 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Xhef.io
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto"
          >
            <nav className="flex flex-col h-full">
              <div className="flex-grow p-4">
                <ul className="space-y-2">
                  {navItems.map(({ to, icon: Icon, label, exact }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={() => getNavLinkClass(to, exact)}
                        end={exact}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Log Out
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="hidden lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-64 lg:bg-white dark:lg:bg-gray-800 lg:shadow-lg lg:flex lg:flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Xhef.io
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kitchen Management
          </p>
        </div>
        <ul className="space-y-2 p-4 flex-grow">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={() => getNavLinkClass(to, exact)}
                end={exact}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </Button>
        </div>
      </nav>

      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          key={location.pathname}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default Layout;
