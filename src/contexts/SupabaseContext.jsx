import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(initialSession);
          setUserId(initialSession?.user?.id || null);
          
          if (initialSession?.user?.id) {
            await initializeUserData(initialSession.user.id);
          }
        }

        // Set up real-time auth subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUserId(currentSession?.user?.id || null);

            if (currentSession?.user?.id) {
              await initializeUserData(currentSession.user.id);
            }

            // Handle specific auth events
            switch (event) {
              case 'SIGNED_IN':
                toast({
                  title: "Welcome back!",
                  description: "Successfully signed in to your account.",
                });
                break;
              case 'SIGNED_OUT':
                toast({
                  title: "Signed out",
                  description: "Successfully signed out of your account.",
                });
                navigate('/');
                break;
              case 'USER_UPDATED':
                toast({
                  title: "Profile updated",
                  description: "Your profile has been updated successfully.",
                });
                break;
              case 'PASSWORD_RECOVERY':
                toast({
                  title: "Password recovery",
                  description: "Please check your email for password reset instructions.",
                });
                break;
            }
          }
        });

        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize authentication. Please refresh the page.",
          });
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const initializeUserData = async (userId) => {
    if (!userId) return false;

    try {
      // Check if user has any categories
      const { data: existingCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (categoriesError) throw categoriesError;

      // If no categories exist, create default ones
      if (!existingCategories?.length) {
        const defaultCategories = [
          'Produce',
          'Meat',
          'Dairy',
          'Dry Goods',
          'Beverages',
          'Supplies'
        ];

        for (const categoryName of defaultCategories) {
          const { error } = await supabase
            .from('categories')
            .insert({
              name: categoryName,
              user_id: userId,
              created_at: new Date().toISOString()
            });

          if (error) throw error;
        }
      }

      // Check if user has any vendors
      const { data: existingVendors, error: vendorsError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (vendorsError) throw vendorsError;

      // If no vendors exist, create a default one
      if (!existingVendors?.length) {
        const { error } = await supabase
          .from('vendors')
          .insert({
            name: 'General Supplier',
            user_id: userId,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error initializing user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize user data. Please try again.",
      });
      return false;
    }
  };

  const handleError = (error) => {
    console.error('Supabase error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "An unexpected error occurred",
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const value = {
    supabase,
    session,
    handleError,
    userId,
    isInitialized
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};