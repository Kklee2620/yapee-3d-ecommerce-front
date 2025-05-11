
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Json } from "@/integrations/supabase/types";

type ShippingAddress = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

type Order = {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string | null;
  shipping_method: string | null;
  shipping_address: ShippingAddress;
  notes: string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch order details
  const { data: order, isLoading: loadingOrder } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id || !user) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Convert Json shipping_address to typed ShippingAddress
      return {
        ...data,
        shipping_address: data.shipping_address as ShippingAddress
      } as Order;
    },
    enabled: !!id && !!user,
  });

  // Fetch order items
  const { data: orderItems, isLoading: loadingItems } = useQuery({
    queryKey: ['orderItems', id],
    queryFn: async () => {
      if (!id || !user) return [];
      
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);
        
      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!id && !!user,
  });

  const isLoading = loadingOrder || loadingItems;

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order || !orderItems) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{t('orderDetail.notFound')}</h1>
        <Button onClick={() => navigate('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('orderDetail.backToOrders')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t('orderDetail.backToOrders')}
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          {t('orderDetail.order')} #{order.id.substring(0, 8)}
        </h1>
        <Badge 
          className={
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }
        >
          {order.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('orderDetail.orderInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('orderDetail.date')}</span>
              <span>{format(new Date(order.created_at), 'dd MMM yyyy HH:mm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('orderDetail.status')}</span>
              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('orderDetail.paymentStatus')}</span>
              <span>{order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</span>
            </div>
            {order.payment_method && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orderDetail.paymentMethod')}</span>
                <span>{order.payment_method}</span>
              </div>
            )}
            {order.shipping_method && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orderDetail.shippingMethod')}</span>
                <span>{order.shipping_method}</span>
              </div>
            )}
            {order.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">{t('orderDetail.notes')}</p>
                  <p>{order.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('orderDetail.shippingAddress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {order.shipping_address.firstName} {order.shipping_address.lastName}
            </p>
            <p className="mt-1">{order.shipping_address.address}</p>
            <p>
              {order.shipping_address.city}, {order.shipping_address.postalCode}
            </p>
            <p>{order.shipping_address.country}</p>
            <p className="mt-2">{order.shipping_address.phone}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('orderDetail.items')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">{t('orderDetail.product')}</th>
                  <th className="p-4 text-center font-medium">{t('orderDetail.quantity')}</th>
                  <th className="p-4 text-right font-medium">{t('orderDetail.price')}</th>
                  <th className="p-4 text-right font-medium">{t('orderDetail.total')}</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">{item.product_name}</td>
                    <td className="p-4 text-center">{item.quantity}</td>
                    <td className="p-4 text-right">${item.product_price.toFixed(2)}</td>
                    <td className="p-4 text-right">${(item.product_price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} />
                  <td className="p-4 text-right font-medium">{t('orderDetail.subtotal')}</td>
                  <td className="p-4 text-right">${order.total_amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2} />
                  <td className="p-4 text-right font-medium">{t('orderDetail.shipping')}</td>
                  <td className="p-4 text-right">{t('orderDetail.free')}</td>
                </tr>
                <tr>
                  <td colSpan={2} />
                  <td className="p-4 text-right font-bold">{t('orderDetail.total')}</td>
                  <td className="p-4 text-right font-bold">${order.total_amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
