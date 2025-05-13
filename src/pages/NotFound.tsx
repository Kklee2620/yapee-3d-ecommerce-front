
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">{t('error.pageNotFound')}</p>
        <p className="text-gray-500 mb-6">{t('error.pageNotFoundMessage')}</p>
        <Button asChild className="three-d-button">
          <Link to="/">
            {t('error.returnHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
