/**
 * GallerySection.jsx
 * Galería de fotos de instalaciones y local.
 */

import { useScrollReveal } from '../../hooks/useScrollReveal';
import './GallerySection.css';

const GALLERY_ITEMS = [
    { id: 1, caption: 'Instalación Premium', size: 'large' },
    { id: 2, caption: 'Detalle de Cableado', size: 'small' },
    { id: 3, caption: 'Showroom Principal', size: 'small' },
    { id: 4, caption: 'Bajos Potentes', size: 'small' },
    { id: 5, caption: 'Ajuste de Audio', size: 'small' },
];

const GallerySection = () => {
    const ref = useScrollReveal();

    return (
        <section className="gallery reveal" ref={ref}>
            <div className="gallery__container">
                <div className="section-header section-header--center">
                    <span className="section-label">Galería</span>
                    <div className="divider divider--center" />
                    <h2 className="section-title">Nuestras Instalaciones</h2>
                    <p className="section-subtitle">
                        Echa un vistazo a la calidad de nuestro trabajo y la variedad de productos en stock.
                    </p>
                </div>

                <div className="gallery__grid">
                    {GALLERY_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className={`gallery__item ${item.size === 'large' ? 'gallery__item--large' : ''}`}
                        >
                            {/* Usamos placeholders ya que no hay imágenes reales aún */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'var(--color-bg-card)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem'
                                }}
                            >
                                📸
                            </div>
                            <div className="gallery__overlay">
                                <span className="gallery__caption">{item.caption}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
