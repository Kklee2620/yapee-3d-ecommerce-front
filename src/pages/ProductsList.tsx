
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, FilterX, Loader2 } from 'lucide-react';

const ProductsList = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [onlyNewProducts, setOnlyNewProducts] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch all products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `);
        
      if (error) throw error;
      return data;
    },
  });

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    },
  });

  // Filter products
  const filteredProducts = products
    ? products.filter((product) => {
        // Filter by search query
        const matchesSearch =
          !searchQuery ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filter by category
        const matchesCategory = !selectedCategory || product.category_id === selectedCategory;

        // Filter by price
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];

        // Filter by new products
        const matchesNew = !onlyNewProducts || product.is_new;

        return matchesSearch && matchesCategory && matchesPrice && matchesNew;
      })
    : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, 1000]);
    setOnlyNewProducts(false);
    setSortBy('newest');
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">{t('products.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">{t('products.filters')}</h2>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} {t('products.items')}
              </span>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <FilterX className="h-4 w-4 mr-2" /> {t('products.resetFilters')}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('products.searchProducts')}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-3">{t('products.categories')}</h3>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-categories"
                          checked={!selectedCategory}
                          onCheckedChange={() => setSelectedCategory(null)}
                        />
                        <Label htmlFor="all-categories">{t('products.allCategories')}</Label>
                      </div>
                      {categories?.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={selectedCategory === category.id}
                            onCheckedChange={() =>
                              setSelectedCategory(
                                selectedCategory === category.id ? null : category.id
                              )
                            }
                          />
                          <Label htmlFor={category.id}>{category.name}</Label>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium mb-3">{t('products.priceRange')}</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 1000]}
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Only New Products */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-products"
                  checked={onlyNewProducts}
                  onCheckedChange={(checked) =>
                    setOnlyNewProducts(checked as boolean)
                  }
                />
                <Label htmlFor="new-products">{t('products.onlyNewProducts')}</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 sm:mb-0">
              {t('products.products')}
            </h2>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('products.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('products.newest')}</SelectItem>
                <SelectItem value="price-asc">{t('products.priceLowToHigh')}</SelectItem>
                <SelectItem value="price-desc">{t('products.priceHighToLow')}</SelectItem>
                <SelectItem value="name">{t('products.nameAZ')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url || '/placeholder.svg',
                    category: product.category?.name,
                    is_new: product.is_new,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">{t('products.noProducts')}</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {t('products.noProductsMessage')}
              </p>
              <Button onClick={resetFilters}>{t('products.resetFilters')}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
