/**
 * HomePage.jsx
 * Página de inicio que ensambla todas las secciones del Home.
 */

import HeroSection from '../features/home/HeroSection';
import FeaturedProducts from '../features/home/FeaturedProducts';
import CategoriesSection from '../features/home/CategoriesSection';
import BrandsSection from '../features/home/BrandsSection';
import GallerySection from '../features/home/GallerySection';
import TestimonialsSection from '../features/home/TestimonialsSection';

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
