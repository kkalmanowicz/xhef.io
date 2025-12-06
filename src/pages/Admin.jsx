import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSupabase } from "@/contexts/SupabaseContext";
import CategoryManager from "@/components/inventory/CategoryManager";
import VendorManager from "@/components/inventory/VendorManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Admin() {
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const { supabase, userId } = useSupabase();

  useEffect(() => {
    if (userId) {
      fetchCategories();
      fetchVendors();
    }
  }, [userId]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (!error) {
      setCategories(data || []);
    }
  };

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (!error) {
      setVendors(data || []);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <Tabs defaultValue="categories" className="p-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <CategoryManager
              categories={categories}
              onCategoriesChange={setCategories}
            />
          </TabsContent>
          <TabsContent value="vendors">
            <VendorManager
              vendors={vendors}
              onVendorsChange={setVendors}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default Admin;