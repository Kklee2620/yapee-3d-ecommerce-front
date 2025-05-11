
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Cart = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex flex-col justify-center items-center min-h-[50vh]">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
        <p className="text-muted-foreground mb-6">{t('cart.emptyMessage')}</p>
        <Button asChild>
          <Link to="/products">{t('cart.continueShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.yourCart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('cart.items', { count: totalItems })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-4">
                  <div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/products/${item.product_id}`} className="font-medium hover:text-primary">
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                      </div>
                      <p className="font-medium">${(item.quantity * item.product.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          type="button"
                          className="p-2 hover:bg-muted"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          type="button"
                          className="p-2 hover:bg-muted"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product_id)}
                        title={t('cart.removeItem')}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('cart.summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>{t('cart.calculated')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>{t('cart.total')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              {isAuthenticated ? (
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    {t('cart.checkout')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full" size="lg">
                  <Link to="/login">{t('cart.loginToCheckout')}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
