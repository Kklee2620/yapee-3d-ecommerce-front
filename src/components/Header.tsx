
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Globe,
  X,
} from 'lucide-react';

const Header = () => {
  const { t, changeLanguage } = useLanguage();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartItems, totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full ${
        scrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'
      } transition-all duration-200`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="text-xl font-bold">
              Yapee
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="block py-2 px-3 text-foreground transition-colors hover:text-primary">
                  {t('nav.home')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/products" className="block py-2 px-3 text-foreground transition-colors hover:text-primary">
                  {t('nav.products')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className="block py-2 px-3 text-foreground transition-colors hover:text-primary">
                  {t('nav.about')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className="block py-2 px-3 text-foreground transition-colors hover:text-primary">
                  {t('nav.contact')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Section */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              title={t('nav.search')}
            >
              <Search className="h-[1.2rem] w-[1.2rem]" />
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title={t('nav.language')}>
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('nav.selectLanguage')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('vi')}>
                  Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('zh')}>
                  中文
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" title={t('nav.cart')}>
                <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title={t('nav.account')}>
                    <User className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t('nav.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">{t('nav.orders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  title={t('nav.menu')}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Yapee</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link 
                      to="/" 
                      className="block py-2 text-lg hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.home')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/products" 
                      className="block py-2 text-lg hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.products')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/about" 
                      className="block py-2 text-lg hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/contact" 
                      className="block py-2 text-lg hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.contact')}
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-start p-4 sm:p-6 md:p-10">
          <div className="container mx-auto mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('nav.search')}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder={t('nav.searchPlaceholder')}
                className="w-full h-12 pl-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
