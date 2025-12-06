import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import StatCard from "@/components/dashboard/StatCard";
import PrepListSection from "@/components/dashboard/PrepListSection";
import LowStockAlertsSection from "@/components/dashboard/LowStockAlertsSection";
import RecentActivitySection from "@/components/dashboard/RecentActivitySection";
import {
  AlertCircle,
  Clock,
  Calendar,
  Scale,
  Loader2
} from "lucide-react";

function Dashboard() {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [stats, setStats] = useState({ lowStock: 0, prepNeeded: 0, upcomingEvents: 0, waste: 0 });
  const [prepItems, setPrepItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!userId || !supabase) return;
    if (isMounted.current) setIsLoading(true);
    try {
      const [inventoryRes, prepRes, activityRes, wasteRes] = await Promise.all([
        supabase
          .from('inventory_items')
          .select('id, name, current_stock, par_level, unit, default_price, last_price, categories (name), vendors (name)')
          .eq('user_id', userId)
          .not('current_stock', 'is', null)
          .not('par_level', 'is', null)
          .order('current_stock', { ascending: true }),
        supabase
          .from('prep_items')
          .select('id, name, current_stock, par_level, yield_unit, status')
          .eq('user_id', userId)
          .not('current_stock', 'is', null)
          .not('par_level', 'is', null)
          .order('current_stock', { ascending: true }),
        supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('waste_items')
          .select('quantity, unit, created_at')
          .eq('user_id', userId)
          .gte('created_at', new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()) 
      ]);

      if (!isMounted.current) return;

      if (inventoryRes.error) throw inventoryRes.error;
      if (prepRes.error) throw prepRes.error;
      if (activityRes.error) throw activityRes.error;
      if (wasteRes.error) throw wasteRes.error;

      const actualLowStock = inventoryRes.data?.filter(item => item.current_stock < item.par_level) || [];
      setLowStockItems(actualLowStock);

      const prepNeeded = prepRes.data?.filter(item => item.current_stock < item.par_level).map(item => ({
        ...item,
        status: item.status || (!item.current_stock ? 'urgent' : 'needed') 
      })) || [];
      setPrepItems(prepNeeded);
      
      setRecentActivity(activityRes.data || []);

      const weeklyWasteAmount = wasteRes.data?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;

      setStats({
        lowStock: actualLowStock.length,
        prepNeeded: prepNeeded.length,
        upcomingEvents: 0, 
        waste: weeklyWasteAmount 
      });

    } catch (error) {
      if (isMounted.current) {
        console.error('Error fetching dashboard data:', error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load dashboard data" });
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [supabase, userId, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!userId || !supabase) return;
    const channels = ['inventory_items', 'prep_items', 'activity_log', 'waste_items', 'order_items'].map(table => {
      const channel = supabase
        .channel(`dashboard-${table}-changes-${userId}-${Date.now()}`)
        .on('postgres_changes', { event: '*', schema: 'public', table, filter: `user_id=eq.${userId}` },
          (payload) => {
            console.log(`${table} change received on dashboard!`, payload);
            fetchDashboardData(); 
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Dashboard subscribed to ${table}`);
          }
          if (status === 'CHANNEL_ERROR') {
            console.error(`Dashboard channel error for ${table}:`, err);
          }
        });
      return channel;
    });
    return () => {
      channels.forEach(channel => {
        if (supabase && channel) {
          supabase.removeChannel(channel).catch(err => console.error("Error removing dashboard channel:", err));
        }
      });
    };
  }, [supabase, userId, fetchDashboardData]);

  const handleItemAddedToOrder = useCallback((itemId) => {
    if (isMounted.current) {
      setLowStockItems(prevItems => prevItems.filter(item => item.id !== itemId));
      // Optionally update stats if it's critical for stats.lowStock to be immediately accurate
      // setStats(prevStats => ({...prevStats, lowStock: prevStats.lowStock -1 })); 
      // However, fetchDashboardData will eventually correct this via real-time or next load.
    }
  }, []);

  const statCardData = [
    { label: "Low Stock Items", value: stats.lowStock, icon: AlertCircle, color: "text-red-500", link: "/dashboard/inventory" },
    { label: "Prep Items Needed", value: stats.prepNeeded, icon: Clock, color: "text-yellow-500", link: "/dashboard/prep-list" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: Calendar, color: "text-blue-500", link: "/dashboard/events" },
    { label: "Waste This Week", value: `${stats.waste.toFixed(1)} units`, icon: Scale, color: "text-green-500", link: "/dashboard/waste" }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardData.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrepListSection prepItems={prepItems} />
        <LowStockAlertsSection lowStockItems={lowStockItems} onItemAddedToOrder={handleItemAddedToOrder} />
        <RecentActivitySection recentActivity={recentActivity} />
      </div>
    </div>
  );
}

export default Dashboard;