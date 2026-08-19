/**
 * HomePage.jsx
 * Página de inicio que ensambla todas las secciones del Home.
 */

import HeroSection from './views/HeroSection/HeroSection';
import FeaturedProducts from './views/FeaturedProducts/FeaturedProducts';
import CategoriesSection from './views/CategoriesSection/CategoriesSection';
import BrandsSection from './views/BrandsSection/BrandsSection';
import GallerySection from './views/GallerySection/GallerySection';
import TestimonialsSection from './views/TestimonialsSection/TestimonialsSection';

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <FeaturedProducts />
            <CategoriesSection />
            <BrandsSection />
            <GallerySection />
            <TestimonialsSection />
        </>
    );
};

export default HomePage;
