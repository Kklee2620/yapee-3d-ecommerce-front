
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PenLine, User, MapPin, Package, Star, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

const Profile = () => {
  const { user, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!profile) return;
    
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi cập nhật thông tin');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      toast.success('Cập nhật mật khẩu thành công!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Lỗi cập nhật mật khẩu');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Người dùng';

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          TRANG CHỦ
        </Link>
        <span className="mx-2 text-muted-foreground">{'>'}</span>
        <span className="text-sm font-medium">TÀI KHOẢN CỦA TÔI</span>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">TÀI KHOẢN CỦA TÔI</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-4 rounded-lg">
            <nav className="space-y-2">
              <Link to="/profile" className="flex items-center p-3 bg-white rounded-md shadow-sm">
                <User className="h-5 w-5 mr-3" />
                <span className="font-medium">TÀI KHOẢN CỦA TÔI</span>
              </Link>
              <Link to="/profile" className="flex items-center p-3 hover:bg-white rounded-md transition-colors">
                <User className="h-5 w-5 mr-3" />
                <span>THÔNG TIN CÁ NHÂN</span>
              </Link>
              <Link to="/addresses" className="flex items-center p-3 hover:bg-white rounded-md transition-colors">
                <MapPin className="h-5 w-5 mr-3" />
                <span>SỔ ĐỊA CHỈ</span>
              </Link>
              <Link to="/orders" className="flex items-center p-3 hover:bg-white rounded-md transition-colors">
                <Package className="h-5 w-5 mr-3" />
                <span>ĐƠN HÀNG</span>
              </Link>
              <Link to="/reviews" className="flex items-center p-3 hover:bg-white rounded-md transition-colors">
                <Star className="h-5 w-5 mr-3" />
                <span>ĐÁNH GIÁ CỦA TÔI</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="flex items-center w-full p-3 hover:bg-white rounded-md transition-colors text-left"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>ĐĂNG XUẤT</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin cá nhân</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleUpdateProfile}
                >
                  <PenLine className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{fullName} - {profile?.phone || 'Chưa cập nhật số điện thoại'}</p>
                    <p>Email: {user?.email}</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => {
                        const passwordTab = document.getElementById('password-tab');
                        if (passwordTab) passwordTab.click();
                      }}
                    >
                      Đổi mật khẩu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin giao hàng</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleUpdateProfile}
                >
                  <PenLine className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-medium">{fullName} - {profile?.phone || 'Chưa cập nhật số điện thoại'}</p>
                  <p className="mt-1">
                    Địa chỉ: {profile?.address || 'Chưa cập nhật địa chỉ'}
                    {profile?.city ? `, ${profile.city}` : ''}
                    {profile?.country ? `, ${profile.country}` : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>ĐƠN HÀNG GẦN ĐÂY</CardTitle>
                <Link to="/orders" className="text-primary hover:underline text-sm">
                  Xem tất cả đơn hàng
                </Link>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mã đơn hàng: #123456789</p>
                      <p className="text-sm text-muted-foreground">Ngày đặt hàng: 08/05/2023</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Xem chi tiết</Button>
                      <Button variant="secondary" size="sm">Đặt lại</Button>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span>1 sản phẩm</span>
                    <span className="font-medium text-red-500">1.749.000 ₫</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change - Hidden by default */}
            <div className="hidden">
              <Tabs defaultValue="account">
                <TabsList className="mb-6">
                  <TabsTrigger value="account">Tài khoản</TabsTrigger>
                  <TabsTrigger id="password-tab" value="password">Mật khẩu</TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Đổi mật khẩu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="newPassword">Mật khẩu mới</label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>

                        <Button type="submit" disabled={updating}>
                          {updating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang cập nhật
                            </>
                          ) : (
                            'Cập nhật mật khẩu'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
