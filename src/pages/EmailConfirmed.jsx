import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, XCircle, Loader2, ChefHat } from 'lucide-react';

function EmailConfirmed() {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setMessage('Your email has been confirmed successfully!');

          toast({
            title: 'Email confirmed!',
            description: 'You can now sign in to your account.',
            duration: 5000,
          });

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          throw new Error('Invalid confirmation link');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(
          'There was an error confirming your email. Please try signing up again or contact support.'
        );

        toast({
          variant: 'destructive',
          title: 'Confirmation failed',
          description: error.message,
          duration: 8000,
        });
      }
    };

    handleEmailConfirmation();
  }, [searchParams, supabase, navigate, toast]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <ChefHat className="h-16 w-16 text-gray-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirming your email...';
      case 'success':
        return 'Email confirmed!';
      case 'error':
        return 'Confirmation failed';
      default:
        return 'Email Confirmation';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">{getIcon()}</div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {getTitle()}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You will be redirected to the login page in a few seconds...
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Sign In
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Button onClick={() => navigate('/signup')} className="w-full">
                Try Sign Up Again
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please wait while we verify your email...
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default EmailConfirmed;
