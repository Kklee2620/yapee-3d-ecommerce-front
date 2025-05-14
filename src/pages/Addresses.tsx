
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Định nghĩa schema cho form địa chỉ
const addressFormSchema = z.object({
  address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
  city: z.string().min(1, { message: "Thành phố không được để trống" }),
  country: z.string().min(1, { message: "Quốc gia không được để trống" }),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Interface cho địa chỉ
interface Address {
  id: string;
  user_id: string;
  address: string;
  city: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

const Addresses = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: "",
      city: "",
      country: "",
      isDefault: false,
    },
  });

  // Tải danh sách địa chỉ
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        // Sử dụng truy vấn SQL thay vì truy cập bảng trực tiếp
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (error) throw error;
        setAddresses(data as Address[] || []);
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
        toast({
          title: t('error.title'),
          description: t('error.fetchAddresses'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user, toast, t]);

  // Xử lý thêm địa chỉ mới
  const onSubmit = async (data: AddressFormValues) => {
    if (!user) return;

    try {
      // Sử dụng truy vấn SQL thay vì truy cập bảng trực tiếp
      const { error } = await supabase
        .rpc('insert_address', {
          p_user_id: user.id,
          p_address: data.address,
          p_city: data.city,
          p_country: data.country,
          p_is_default: data.isDefault,
        });

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.addressAdded'),
      });

      // Reset form và tải lại danh sách
      form.reset();
      setShowAddForm(false);
      
      // Tải lại danh sách địa chỉ
      const { data: updatedAddresses, error: fetchError } = await supabase
        .rpc('get_user_addresses', {
          p_user_id: user.id
        });
        
      if (fetchError) throw fetchError;
      setAddresses(updatedAddresses as Address[] || []);
      
    } catch (error: any) {
      console.error("Error adding address:", error);
      toast({
        title: t('error.title'),
        description: t('error.addAddress'),
        variant: "destructive",
      });
    }
  };

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = async (id: string) => {
    try {
      // Sử dụng truy vấn SQL thay vì truy cập bảng trực tiếp
      const { error } = await supabase
        .rpc('delete_address', {
          p_id: id
        });

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.addressDeleted'),
      });

      // Cập nhật danh sách địa chỉ
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast({
        title: t('error.title'),
        description: t('error.deleteAddress'),
        variant: "destructive",
      });
    }
  };

  // Xử lý đặt địa chỉ mặc định
  const handleSetDefault = async (id: string) => {
    try {
      // Sử dụng truy vấn SQL thay vì truy cập bảng trực tiếp
      const { error } = await supabase
        .rpc('set_default_address', {
          p_user_id: user?.id,
          p_id: id
        });

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.defaultAddressSet'),
      });

      // Cập nhật danh sách địa chỉ
      setAddresses(
        addresses.map(addr => ({
          ...addr,
          is_default: addr.id === id
        }))
      );
    } catch (error: any) {
      console.error("Error setting default address:", error);
      toast({
        title: t('error.title'),
        description: t('error.setDefaultAddress'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">{t('profile.addresses')}</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Danh sách địa chỉ */}
          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className={address.is_default ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {t('profile.address')}
                      {address.is_default && (
                        <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-md">
                          {t('profile.defaultAddress')}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{address.address}</p>
                    <p>{address.city}</p>
                    <p>{address.country}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {!address.is_default && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleSetDefault(address.id)}
                      >
                        {t('profile.setAsDefault')}
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      {t('actions.delete')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {t('profile.noAddresses')}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Thêm địa chỉ mới */}
          {!showAddForm ? (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {t('profile.addNewAddress')}
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.addNewAddress')}</CardTitle>
                <CardDescription>
                  {t('profile.addNewAddressDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.addressLine')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.city')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('profile.country')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel>{t('profile.setAsDefault')}</FormLabel>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 pt-2">
                      <Button type="submit">{t('actions.save')}</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                      >
                        {t('actions.cancel')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Addresses;

