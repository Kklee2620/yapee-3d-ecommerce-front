
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, PackageOpen } from "lucide-react";

type Order = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
};

const Orders = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Fetch user orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  // Format status for display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex flex-col justify-center items-center min-h-[50vh]">
        <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('orders.noOrders')}</h2>
        <p className="text-muted-foreground mb-6">{t('orders.noOrdersMessage')}</p>
        <Button asChild>
          <Link to="/products">{t('orders.startShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">{t('orders.yourOrders')}</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-lg">
                  {t('orders.orderId')}: {order.id.substring(0, 8)}
                </CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground mt-2">
                <span>
                  {t('orders.date')}: {format(new Date(order.created_at), 'dd MMM yyyy')}
                </span>
                <span>
                  {t('orders.total')}: ${order.total_amount.toFixed(2)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <Button asChild>
                  <Link to={`/orders/${order.id}`}>{t('orders.viewDetails')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
