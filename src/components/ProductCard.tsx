
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/components/ui/sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    isNew?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`${t('product.addToCart')} ${product.name}`);
    // In a real application, this would add the product to the cart
  };

  return (
    <Card 
      className="three-d-card overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <Link to={`/products/${product.id}`} className="block">
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            {product.category && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                {product.category}
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                New
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="text-lg font-bold mb-3">
              ${product.price.toFixed(2)}
            </div>
            <Button 
              onClick={handleAddToCart}
              className="w-full three-d-button"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 
              {t('product.addToCart')}
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
