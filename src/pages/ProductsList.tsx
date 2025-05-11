
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

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
  },
  {
    id: '9',
    name: 'Designer Sunglasses',
    price: 129.99,
    image: '/placeholder.svg',
    category: 'Fashion'
  },
  {
    id: '10',
    name: 'Smart Home Hub',
    price: 149.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  },
  {
    id: '11',
    name: 'Portable Power Bank',
    price: 39.99,
    image: '/placeholder.svg',
    category: 'Electronics'
  },
  {
    id: '12',
    name: 'Stainless Steel Water Bottle',
    price: 29.99,
    image: '/placeholder.svg',
    category: 'Home'
  }
];

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

const ProductsList = () => {
  const { t } = useLanguage();
  const [filteredProducts, setFilteredProducts] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    let result = [...demoProducts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        product => product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOrder) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, sortOrder]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('nav.products')}</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder={t('nav.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full h-full border border-border rounded px-4 py-2"
          >
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Button
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
