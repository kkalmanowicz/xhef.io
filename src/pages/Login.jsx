import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ChefHat, Loader2, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { supabase, handleError } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Log login attempt (without sensitive data)
    console.log('🔐 Login attempt:', {
      email: email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Detailed error logging
      if (error) {
        console.error('❌ Login error details:', {
          error_code: error.status,
          error_message: error.message,
          email: email,
          timestamp: new Date().toISOString(),
          supabase_error: error
        });

        let errorMessage = "Invalid email or password";
        let errorTitle = "Login failed";

        // Enhanced error handling based on Supabase error types
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before signing in";
          errorTitle = "Email not confirmed";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "The email or password you entered is incorrect. Please try again.";
        } else if (error.message.includes("Email not found") || error.message.includes("User not found")) {
          errorMessage = "No account found with this email address. Please check your email or sign up for a new account.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a few minutes before trying again.";
          errorTitle = "Rate limited";
        } else if (error.message.includes("Password")) {
          errorMessage = "Incorrect password. Please check your password and try again.";
        } else if (error.status === 422) {
          errorMessage = "Please check your email and password format and try again.";
        } else if (error.status >= 500) {
          errorMessage = "Server error. Please try again in a few moments.";
          errorTitle = "Server error";
        }

        throw new Error(errorMessage);
      }

      // Success logging
      if (data?.user) {
        console.log('✅ Login successful:', {
          user_id: data.user.id,
          email: data.user.email,
          email_confirmed: data.user.email_confirmed_at !== null,
          created_at: data.user.created_at,
          last_sign_in: data.user.last_sign_in_at,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your account.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('❌ Login failed:', {
        error_message: error.message,
        email: email,
        timestamp: new Date().toISOString()
      });

      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsResettingPassword(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for password reset instructions.",
        duration: 6000,
      });
      setIsResetDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "Please check your email and try again.",
        duration: 5000,
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Xhef.io</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email address</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={isResettingPassword}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
                disabled={isResettingPassword}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Instructions"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Login;