
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Sample product data
const demoProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 299.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Designer Leather Wallet',
    price: 59.99,
    image: '/placeholder.svg',
    category: 'Fashion'
  },
  {
    id: '4',
    name: 'Ultra HD Smart TV',
    price: 699.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  },
  {
    id: '5',
    name: 'Wireless Gaming Mouse',
    price: 79.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Handcrafted Coffee Mug',
    price: 24.99,
    image: '/placeholder.svg',
    category: 'Home'
  },
  {
    id: '7',
    name: 'Fitness Tracker Band',
    price: 49.99,
    image: '/placeholder.svg',
    category: 'Sports'
  },
  {
    id: '8',
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  }
];

const FeaturedProducts = () => {
  const { t } = useLanguage();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  const handleAddToCart = (productId: string) => {
    toast.success(`${t('product.addToCart')} ${productId} ${t('success')}`);
    // In a real application, this would add the product to the cart
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t('home.featured')}</h2>
          <Link to="/products" className="text-primary hover:underline">
            {t('home.viewAll')} →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {demoProducts.slice(0, 8).map((product) => (
            <Card 
              key={product.id}
              className="three-d-card overflow-hidden"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="object-cover w-full h-full transition-transform duration-500"
                    style={{
                      transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="text-lg font-bold mb-3">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full three-d-button"
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> 
                    {t('product.addToCart')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
