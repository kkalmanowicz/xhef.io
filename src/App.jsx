import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
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