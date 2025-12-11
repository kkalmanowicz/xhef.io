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

    // Failsafe timeout - ensure loading never hangs indefinitely
    const failsafeTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn(
          'Auth initialization taking too long, proceeding without session'
        );
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 15000); // 15 second maximum loading time

    const initializeAuth = async () => {
      try {
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 10000)
        );

        const {
          data: { session: initialSession },
          error: sessionError,
        } = await Promise.race([sessionPromise, timeoutPromise]);

        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(initialSession);
          setUserId(initialSession?.user?.id || null);

          if (initialSession?.user?.id) {
            // Initialize user data in background, don't block UI
            initializeUserData(initialSession.user.id).catch(console.warn);
          }
        }

        // Set up real-time auth subscription
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUserId(currentSession?.user?.id || null);

            if (currentSession?.user?.id) {
              // Initialize user data in background for new sign-ins only
              if (event === 'SIGNED_IN') {
                initializeUserData(currentSession.user.id).catch(console.warn);
              }
            }

            // Handle specific auth events
            switch (event) {
              case 'SIGNED_IN':
                toast({
                  title: 'Welcome back!',
                  description: 'Successfully signed in to your account.',
                });
                break;
              case 'SIGNED_OUT':
                toast({
                  title: 'Signed out',
                  description: 'Successfully signed out of your account.',
                });
                navigate('/');
                break;
              case 'USER_UPDATED':
                toast({
                  title: 'Profile updated',
                  description: 'Your profile has been updated successfully.',
                });
                break;
              case 'PASSWORD_RECOVERY':
                toast({
                  title: 'Password recovery',
                  description:
                    'Please check your email for password reset instructions.',
                });
                break;
            }
          }
        });

        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
          clearTimeout(failsafeTimeout);
        }

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description:
              'Failed to initialize authentication. Please refresh the page.',
          });
          setIsLoading(false);
          clearTimeout(failsafeTimeout);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(failsafeTimeout);
    };
  }, []);

  const initializeUserData = async userId => {
    if (!userId) return false;

    try {
      // Skip initialization for returning users - only do it for completely new users
      // Check if user has any data at all
      const { data: existingCategories, error: categoriesError } =
        await Promise.race([
          supabase
            .from('categories')
            .select('id')
            .eq('user_id', userId)
            .limit(1),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          ),
        ]);

      if (categoriesError && categoriesError.message !== 'Timeout') {
        throw categoriesError;
      }

      // If query timed out or user already has data, skip initialization
      if (
        categoriesError?.message === 'Timeout' ||
        existingCategories?.length > 0
      ) {
        return true;
      }

      // Only create default data for completely new users with no existing data
      const defaultCategories = [
        'Produce',
        'Meat',
        'Dairy',
        'Dry Goods',
        'Beverages',
        'Supplies',
      ];

      const categoryInserts = defaultCategories.map(name => ({
        name,
        user_id: userId,
        created_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from('categories')
        .insert(categoryInserts);

      if (insertError) throw insertError;

      // Create default vendor
      const { error: vendorError } = await supabase.from('vendors').insert({
        name: 'General Supplier',
        user_id: userId,
        created_at: new Date().toISOString(),
      });

      if (vendorError) throw vendorError;

      return true;
    } catch (error) {
      console.error('Error initializing user data:', error);
      // Don't show error toast for returning users - just log it
      if (error.message !== 'Timeout') {
        console.warn('Skipping user data initialization for returning user');
      }
      return false;
    }
  };

  const handleError = error => {
    console.error('Supabase error:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
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
    isInitialized,
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
