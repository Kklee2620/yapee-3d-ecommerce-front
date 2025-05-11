
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

// Sample product data
const newProducts = [
  {
    id: '101',
    name: 'Next Gen Gaming Console',
    price: 499.99,
    image: '/placeholder.svg'
  },
  {
    id: '102',
    name: 'Smartphone Pro Max',
    price: 999.99,
    image: '/placeholder.svg'
  },
  {
    id: '103',
    name: 'Designer Sneakers',
    price: 149.99,
    image: '/placeholder.svg'
  },
  {
    id: '104',
    name: 'Smart Home Assistant',
    price: 129.99,
    image: '/placeholder.svg'
  }
];

const NewArrivals = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t('home.newArrivals')}</h2>
          <Link to="/products/new" className="text-primary hover:underline">
            {t('home.viewAll')} →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <Card key={product.id} className="three-d-card overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                    New
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
