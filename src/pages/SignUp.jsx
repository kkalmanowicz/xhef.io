import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ChefHat, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Enhanced password validation based on Supabase requirements
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordIssues = [];

      if (password.length < 8) {
        passwordIssues.push("at least 8 characters");
      }
      if (!/[a-z]/.test(password)) {
        passwordIssues.push("a lowercase letter");
      }
      if (!/[A-Z]/.test(password)) {
        passwordIssues.push("an uppercase letter");
      }
      if (!/[0-9]/.test(password)) {
        passwordIssues.push("a number");
      }
      if (!/[^a-zA-Z0-9]/.test(password)) {
        passwordIssues.push("a special character (!@#$%^&*)");
      }

      if (passwordIssues.length > 0) {
        newErrors.password = `Password must include ${passwordIssues.join(", ")}`;
      }
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ Signup validation failed:', errors);
      return;
    }

    setIsLoading(true);

    // Log signup attempt (without sensitive data)
    console.log('📝 Signup attempt:', {
      email: email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      redirectTo: window.location.origin + '/email-confirmed'
    });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/email-confirmed'
        }
      });

      // Detailed error logging
      if (error) {
        console.error('❌ Signup error details:', {
          error_code: error.status,
          error_message: error.message,
          email: email,
          timestamp: new Date().toISOString(),
          supabase_error: error
        });

        let errorMessage = error.message || "An error occurred during sign up";
        let errorTitle = "Sign up failed";

        // Enhanced error handling
        if (error.message.includes("User already registered") || error.message.includes("already been registered")) {
          errorMessage = "This email is already registered. Please sign in instead or use a different email.";
          errorTitle = "Email already exists";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Password is too weak. Please follow the password requirements above.";
          errorTitle = "Weak password";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address";
          errorTitle = "Invalid email";
        } else if (error.message.includes("Signup is disabled")) {
          errorMessage = "Account creation is temporarily disabled. Please try again later.";
          errorTitle = "Signup disabled";
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
        console.log('✅ Signup successful:', {
          user_id: data.user.id,
          email: data.user.email,
          email_confirmed: data.user.email_confirmed_at !== null,
          confirmation_sent_at: data.user.confirmation_sent_at,
          created_at: data.user.created_at,
          timestamp: new Date().toISOString()
        });

        setIsSuccess(true);
        toast({
          title: "Account created successfully!",
          description: "Please check your email to confirm your account before signing in.",
          duration: 8000,
        });
      }
    } catch (error) {
      console.error('❌ Signup failed:', {
        error_message: error.message,
        email: email,
        timestamp: new Date().toISOString()
      });

      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Check your email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've sent a confirmation email to <strong>{email}</strong>. Please click the link in the email to verify your account.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Once confirmed, you can sign in to your account.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Go to Sign In
            </Button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email?{" "}
              <button
                onClick={handleSignUp}
                className="text-primary hover:underline"
              >
                Resend confirmation
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Start managing your kitchen efficiently</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;