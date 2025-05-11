
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('footer.about')}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Welcome to Yapee, your trusted online marketplace focused on providing a secure and reliable shopping experience. Our mission is to create a platform where buyers can confidently purchase products knowing that each item is verified for authenticity and quality.
          </p>
          
          <h2>Our Story</h2>
          <p>
            Founded in 2025, Yapee was born out of a simple frustration: the lack of trust in online shopping. Too many consumers have experienced disappointment from counterfeit products, misleading descriptions, or security breaches. We decided to create a better alternative – an e-commerce platform built on the foundations of trust and security.
          </p>
          
          <h2>What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="three-d-card p-6">
              <h3 className="text-xl font-medium mb-2">Product Verification</h3>
              <p>Every product listed on Yapee undergoes a thorough verification process to ensure authenticity and quality.</p>
            </div>
            
            <div className="three-d-card p-6">
              <h3 className="text-xl font-medium mb-2">Seller Verification</h3>
              <p>We carefully vet all sellers on our platform to make sure they meet our high standards for reliability and service.</p>
            </div>
            
            <div className="three-d-card p-6">
              <h3 className="text-xl font-medium mb-2">Advanced Security</h3>
              <p>We employ state-of-the-art security measures to protect your personal information and financial data.</p>
            </div>
            
            <div className="three-d-card p-6">
              <h3 className="text-xl font-medium mb-2">Customer Support</h3>
              <p>Our dedicated support team is available 24/7 to assist with any questions or concerns you might have.</p>
            </div>
          </div>
          
          <h2>Our Vision</h2>
          <p>
            We envision a future where online shopping is synonymous with trust and reliability. A world where consumers can purchase anything online with the same confidence they feel when shopping in person. Yapee aims to be at the forefront of this transformation, setting new standards for e-commerce security and customer satisfaction.
          </p>
          
          <h2>Join Us on Our Journey</h2>
          <p>
            Whether you're a buyer looking for authentic products or a seller wanting to reach trustworthy customers, Yapee welcomes you to be part of our growing community. Together, we can reshape the online shopping experience for the better.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
