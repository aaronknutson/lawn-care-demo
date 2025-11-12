import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import ServicePackages from '../components/home/ServicePackages';
import BeforeAfterGallery from '../components/home/BeforeAfterGallery';
import Testimonials from '../components/home/Testimonials';
import TrustBadges from '../components/home/TrustBadges';
import QuickQuoteCalculator from '../components/home/QuickQuoteCalculator';
import ServiceArea from '../components/home/ServiceArea';

function Home() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Service Packages Section */}
      <ServicePackages />

      {/* Before/After Gallery */}
      <BeforeAfterGallery />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Trust Badges & Guarantees */}
      <TrustBadges />

      {/* Quick Quote Calculator */}
      <QuickQuoteCalculator />

      {/* Service Area Map */}
      <ServiceArea />
    </div>
  );
}

export default Home;
