
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import ProductCard from '@/components/ProductCard';

// Sample product data (would come from API in real application)
const demoProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  price: 199.99,
  oldPrice: 249.99,
  description: 'Experience crystal-clear sound with our premium wireless headphones. Featuring advanced noise cancellation, extended battery life, and comfortable memory foam ear cups for all-day listening.',
  specifications: [
    { name: 'Battery Life', value: 'Up to 30 hours' },
    { name: 'Connectivity', value: 'Bluetooth 5.0' },
    { name: 'Noise Cancellation', value: 'Active' },
    { name: 'Weight', value: '250g' },
    { name: 'Charging', value: 'USB-C' }
  ],
  colors: ['Black', 'White', 'Blue'],
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  stock: 15,
  sku: 'WH-1000XM4',
  category: 'Electronics'
};

// Sample related products
const relatedProducts = [
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 299.99,
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
    id: '8',
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // In a real app, you would fetch the product based on the ID
  const product = demoProduct;
  
  const handleAddToCart = () => {
    toast.success(`${product.name} ${t('product.addToCart')}`);
    // In a real application, this would add the product to the cart
  };

  const handleBuyNow = () => {
    // In a real application, this would navigate to checkout
    handleAddToCart();
  };

  if (!product) {
    return <div className="container mx-auto py-12 px-4">Product not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                } rounded`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} view ${index + 1}`} 
                  className="w-16 h-16 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</span>
              )}
              {product.oldPrice && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                  Save ${(product.oldPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-2">{t('product.color')}</h3>
            <div className="flex space-x-2">
              {product.colors.map((color, index) => (
                <div
                  key={color}
                  className={`cursor-pointer border-2 ${
                    selectedColor === index ? 'border-primary' : 'border-transparent'
                  } rounded p-2`}
                  onClick={() => setSelectedColor(index)}
                >
                  <span className="block px-3">{color}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div>
            <h3 className="font-medium mb-2">{t('product.quantity')}</h3>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 p-0"
              >
                −
              </Button>
              <span className="font-medium text-lg">{quantity}</span>
              <Button 
                variant="outline" 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="h-10 w-10 p-0"
              >
                +
              </Button>
              <span className="text-muted-foreground ml-2">
                {product.stock} {t('product.inStock')}
              </span>
            </div>
          </div>
          
          {/* Add to Cart and Buy Now buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <Button 
              onClick={handleAddToCart}
              className="three-d-button flex-1 text-lg py-6"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t('product.addToCart')}
            </Button>
            <Button 
              onClick={handleBuyNow}
              variant="outline"
              className="flex-1 text-lg py-6 hover-rotate"
            >
              {t('product.buyNow')}
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="pt-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">{t('product.sku')}</span>
              <span>{product.sku}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Category</span>
              <span>{product.category}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <Tabs defaultValue="description" className="max-w-4xl mx-auto">
        <TabsList className="w-full">
          <TabsTrigger value="description" className="flex-1">{t('product.description')}</TabsTrigger>
          <TabsTrigger value="specifications" className="flex-1">{t('product.specifications')}</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-6 bg-card rounded-md mt-2">
          <p className="text-lg">{product.description}</p>
        </TabsContent>
        <TabsContent value="specifications" className="p-6 bg-card rounded-md mt-2">
          <div className="divide-y">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex justify-between py-3">
                <span className="font-medium">{spec.name}</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">{t('product.related')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
