
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b sticky top-0 bg-background z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Yapee
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/" className="hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="hover:text-primary transition-colors">
              {t('nav.products')}
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Search, Cart, Account */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('nav.search')}
                className="pl-8 pr-4 rounded-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'vi' | 'zh')}
                className="bg-transparent border border-border rounded px-2 py-1 text-sm"
              >
                <option value="en">EN</option>
                <option value="vi">VI</option>
                <option value="zh">ZH</option>
              </select>
            </div>

            <Link to="/cart" className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
            
            <Link to="/account" className="p-2 rounded-full hover:bg-muted transition-colors">
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
            <button onClick={toggleMenu} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('nav.search')}
                className="pl-8 pr-4"
              />
            </div>
            
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-primary py-2">{t('nav.home')}</Link>
              <Link to="/products" className="hover:text-primary py-2">{t('nav.products')}</Link>
              <Link to="/about" className="hover:text-primary py-2">{t('nav.about')}</Link>
              <Link to="/contact" className="hover:text-primary py-2">{t('nav.contact')}</Link>
              <Link to="/account" className="hover:text-primary py-2">{t('nav.account')}</Link>
            </nav>
            
            <div className="flex items-center space-x-2 pt-2">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'vi' | 'zh')}
                className="bg-transparent border border-border rounded px-2 py-1 text-sm"
              >
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
