
import { useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const layerOneRef = useRef<HTMLDivElement>(null);
  const layerTwoRef = useRef<HTMLDivElement>(null);

  // Simple parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !layerOneRef.current || !layerTwoRef.current) return;
      
      const scrollPosition = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Only apply effect when the container is in view
      if (scrollPosition > containerTop - window.innerHeight && 
          scrollPosition < containerTop + containerHeight) {
        const relativeScroll = scrollPosition - containerTop + window.innerHeight;
        const factor = relativeScroll / (containerHeight + window.innerHeight);
        
        // Move layers at different speeds
        layerOneRef.current.style.transform = `translateY(${factor * 50}px)`;
        layerTwoRef.current.style.transform = `translateY(${factor * 30}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-accent/10"
    >
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[60vh]">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="three-d-button text-lg px-6 py-6">
                <Link to="/products">
                  {t('home.hero.cta')}
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-lg px-6 py-6 hover-rotate">
                <Link to="/about">
                  {t('nav.about')}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px]">
            {/* 3D parallax container */}
            <div className="parallax-container w-full h-full">
              <div 
                ref={layerOneRef}
                className="parallax-layer"
                style={{ transform: 'translateZ(0px)' }}
              >
                <div className="absolute top-[10%] right-[20%] w-40 h-40 rounded-xl bg-primary/20 animate-float shadow-xl"></div>
                <div className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-accent/40 animate-float shadow-xl" style={{animationDelay: '1s'}}></div>
              </div>
              
              <div 
                ref={layerTwoRef}
                className="parallax-layer"
                style={{ transform: 'translateZ(50px)' }}
              >
                <div className="absolute top-[30%] left-[30%] w-56 h-56 rounded-xl bg-white shadow-2xl animate-rotate-slow three-d-card">
                  <div className="relative w-full h-full p-4 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                      <p className="text-sm font-medium">Premium Electronics</p>
                      <p className="text-xs text-muted-foreground">Verified Authentic</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[50%] right-[10%] w-28 h-28 rounded-full bg-primary shadow-xl animate-float" style={{animationDelay: '2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-3xl"></div>
      </div>
    </div>
  );
};

export default HeroSection;
