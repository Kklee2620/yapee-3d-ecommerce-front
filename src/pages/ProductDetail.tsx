
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package2, Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedProducts', product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', product.category_id)
        .neq('id', id)
        .limit(4);
        
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id,
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">{t('productDetail.notFound')}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <div className="text-sm text-muted-foreground mb-2">
                {product.category.name}
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price && (
                <span className="text-muted-foreground line-through">
                  ${product.compare_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Product Availability */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.inventory_count > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>
              {product.inventory_count > 0
                ? t('productDetail.inStock')
                : t('productDetail.outOfStock')}
            </span>
          </div>

          {/* Product Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span>{t('productDetail.quantity')}</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-y border-input h-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.inventory_count && quantity >= product.inventory_count}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.inventory_count === 0}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t('productDetail.addToCart')}
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="flex items-start gap-3 text-sm text-muted-foreground rounded-lg border p-4 mt-4">
              <Package2 className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-1">
                  {t('productDetail.freeShipping')}
                </p>
                <p>{t('productDetail.shippingInfo')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="mb-6">
            <TabsTrigger value="description">{t('productDetail.description')}</TabsTrigger>
            <TabsTrigger value="specifications">{t('productDetail.specifications')}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-muted-foreground">
            <div className="prose max-w-none">
              <p>{product.description || t('productDetail.noDescription')}</p>
            </div>
          </TabsContent>
          <TabsContent value="specifications">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">{t('productDetail.brand')}</span>
                  <span className="text-muted-foreground">Yapee</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">{t('productDetail.category')}</span>
                  <span className="text-muted-foreground">
                    {product.category?.name || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">{t('productDetail.weight')}</span>
                  <span className="text-muted-foreground">0.5 kg</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">{t('productDetail.dimensions')}</span>
                  <span className="text-muted-foreground">20 × 10 × 5 cm</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('productDetail.relatedProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <a href={`/products/${item.id}`} className="block">
                  <div className="aspect-square bg-muted">
                    <img
                      src={item.image_url || '/placeholder.svg'}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="mt-2 font-bold">${item.price.toFixed(2)}</div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
