import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { LoadingProgress } from '@/components/LoadingProgress';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, skip all checks and allow access
    if (!isSupabaseConfigured) {
      setIsPaid(true);
      setChecking(false);
      return;
    }

    if (authLoading) return;
    if (!user) { setChecking(false); return; }

    const checkAccess = async () => {
      const email = user.email?.trim().toLowerCase();
      if (!email) { setIsPaid(false); setChecking(false); return; }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_paid')
        .ilike('email', email)
        .maybeSingle();

      if (error) console.error('[ProtectedRoute] Erro:', error);

      if (data) {
        setIsPaid((data as any).is_paid ?? false);
      } else {
        await supabase.from('profiles').insert({
          user_id: user.id,
          email: email,
          full_name: user.user_metadata?.full_name || '',
          is_paid: false,
        } as any);
        setIsPaid(false);
      }
      setChecking(false);
    };

    checkAccess();
  }, [user, authLoading]);

  if (authLoading || checking) return <LoadingProgress />;
  if (!isSupabaseConfigured) return <>{children}</>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isPaid) return <Navigate to="/acesso-restrito" replace />;
  return <>{children}</>;
};