/**
 * AboutPage.jsx
 * Página "Sobre Nosotros" que ensambla historia y valores.
 */

import AboutHero from '../features/about/AboutHero';
import ValuesSection from '../features/about/ValuesSection';

const AboutPage = () => {
    return (
        <>
            <AboutHero />
            <ValuesSection />
        </>
    );
};

export default AboutPage;
