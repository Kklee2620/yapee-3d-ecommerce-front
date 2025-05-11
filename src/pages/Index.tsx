
import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewArrivals from '@/components/NewArrivals';
import AboutSection from '@/components/AboutSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  // Add a simple scroll animation effect for the page
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // If element is in viewport
        if (position.top < window.innerHeight * 0.9) {
          element.classList.add('animate-fade-in');
          element.classList.remove('opacity-0');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Initial check
    animateOnScroll();
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <NewArrivals />
      <CTASection />
    </div>
  );
};

export default Index;
