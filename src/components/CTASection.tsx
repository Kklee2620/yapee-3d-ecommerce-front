
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Secure Shopping?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who enjoy our verified products, secure payment options, and exceptional customer service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="three-d-button text-lg px-8 py-6">
              <Link to="/products">
                {t('home.hero.cta')}
              </Link>
            </Button>
            <Button asChild variant="outline" className="text-lg px-8 py-6 hover-rotate">
              <Link to="/contact">
                {t('nav.contact')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl"></div>
      </div>
    </section>
  );
};

export default CTASection;
