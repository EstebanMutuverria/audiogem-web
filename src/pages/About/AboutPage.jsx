/**
 * AboutPage.jsx
 * Página "Sobre Nosotros" que ensambla historia y valores.
 */

import AboutHero from './views/AboutHero/AboutHero';
import ValuesSection from './views/ValuesSection/ValuesSection';

const AboutPage = () => {
    return (
        <>
            <AboutHero />
            <ValuesSection />
        </>
    );
};

export default AboutPage;
