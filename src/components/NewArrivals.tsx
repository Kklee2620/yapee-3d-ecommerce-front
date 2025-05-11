
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const NewArrivals = () => {
  const { t } = useLanguage();

  // Fetch new products
  const { data: newProducts, isLoading } = useQuery({
    queryKey: ['newProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .limit(4);
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t('home.newArrivals')}</h2>
          <Link to="/products" className="text-primary hover:underline">
            {t('home.viewAll')} →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts?.map((product) => (
            <Card key={product.id} className="three-d-card overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                    {t('product.new')}
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
