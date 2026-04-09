import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // behavior: 'smooth' যোগ করলেই স্ক্রলটা অ্যানিমেট হয়ে ওপরে যাবে
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' 
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;