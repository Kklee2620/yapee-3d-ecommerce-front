
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Thiết lập listener cho trạng thái xác thực
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Trạng thái xác thực thay đổi:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast.success('Đăng nhập thành công!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Đã đăng xuất!');
        }
      }
    );

    // Kiểm tra phiên hiện tại
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Phiên hiện tại:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
          },
        },
      });

      if (error) throw error;
      
      // Kiểm tra xem chúng ta có cần tạo profile thủ công hay không
      // Đây là phương án dự phòng trong trường hợp trigger không hoạt động
      if (data.user) {
        console.log('Người dùng đã được tạo:', data.user);
        try {
          // Thêm delay nhỏ để đảm bảo trigger có thời gian thực thi
          setTimeout(async () => {
            try {
              const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user!.id,
                first_name: userData?.firstName || '',
                last_name: userData?.lastName || '',
              }, {
                onConflict: 'id'
              });
  
              if (profileError) {
                console.error('Lỗi khi tạo profile:', profileError);
              }
            } catch (err) {
              console.error('Lỗi khi tạo profile:', err);
            }
          }, 500);
        } catch (profileErr) {
          console.error('Lỗi khi tạo profile:', profileErr);
        }
      }
      
      toast.success('Đăng ký thành công! Hãy kiểm tra email của bạn.');
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error);
      toast.error(error.message || 'Đăng ký thất bại!');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      toast.error(error.message || 'Đăng nhập thất bại!');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Lỗi đăng xuất:', error);
      toast.error(error.message || 'Đăng xuất thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
