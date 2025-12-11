import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import EmailConfirmed from "@/pages/EmailConfirmed";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import PrepItems from "@/pages/PrepItems";
import PrepList from "@/pages/PrepList";
import OrderList from "@/pages/OrderList";
import CompletedOrderPage from "@/pages/CompletedOrderPage";
import Recipes from "@/pages/Recipes";
import Admin from "@/pages/Admin";
import Events from "@/pages/Events";
import Schedule from "@/pages/Schedule";
import Waste from "@/pages/Waste";
import Features from "@/pages/Features";
import Demo from "@/pages/Demo";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import ComingSoon from "@/pages/ComingSoon";
import { useSupabase } from "@/contexts/SupabaseContext";

function PrivateRoute({ children }) {
  const { session } = useSupabase();
  return session ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { session } = useSupabase();
  return !session ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      {/* Placeholder pages for remaining footer links */}
      <Route path="/docs" element={<ComingSoon title="Documentation" description="Comprehensive guides and API documentation coming soon." />} />
      <Route path="/help" element={<ComingSoon title="Help Center" description="FAQ, tutorials, and support resources coming soon." />} />
      <Route path="/guides" element={<ComingSoon title="Best Practice Guides" description="Expert kitchen management guides coming soon." />} />
      <Route path="/privacy" element={<ComingSoon title="Privacy Policy" description="Our privacy policy and data protection information coming soon." />} />
      <Route path="/terms" element={<ComingSoon title="Terms of Service" description="Terms of service and user agreement coming soon." />} />
      <Route path="/security" element={<ComingSoon title="Security" description="Information about our security practices coming soon." />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route path="/email-confirmed" element={<EmailConfirmed />} />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="prep-items" element={<PrepItems />} />
        <Route path="prep-list" element={<PrepList />} />
        <Route path="order-list" element={<OrderList />} />
        <Route path="order/:orderId" element={<CompletedOrderPage />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="events" element={<Events />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="waste" element={<Waste />} />
        <Route path="admin" element={<Admin />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;