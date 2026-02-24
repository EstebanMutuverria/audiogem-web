/**
 * GallerySection.jsx
 * Galería de fotos de instalaciones y local.
 */

import { useScrollReveal } from '../../hooks/useScrollReveal';
import './GallerySection.css';
import foto_1 from '../../assets/gallery_section_pictures/foto-1.jpeg';
import foto_2 from '../../assets/gallery_section_pictures/foto-2.jpeg';
import foto_3 from '../../assets/gallery_section_pictures/foto-3.jpeg';
import foto_4 from '../../assets/gallery_section_pictures/foto-4.jpeg';
import foto_5 from '../../assets/gallery_section_pictures/foto-5.jpeg';

const GALLERY_ITEMS = [
    { id: 1, image: foto_1, caption: 'Calidad Premium', size: 'large' },
    { id: 2, image: foto_2, caption: 'Excelentes componentes', size: 'small' },
    { id: 3, image: foto_3, caption: 'Potencia y Calidad', size: 'small' },
    { id: 4, image: foto_4, caption: 'Variedad de productos', size: 'small' },
    { id: 5, image: foto_5, caption: 'Accesorios de calidad', size: 'small' },
];

const GallerySection = () => {
    const ref = useScrollReveal();

    return (
        <section className="gallery reveal" ref={ref}>
            <div className="gallery__container">
                <div className="section-header section-header--center">
                    <span className="section-label">Galería</span>
                    <div className="divider divider--center" />
                    <h2 className="section-title">Nuestros Productos</h2>
                    <p className="section-subtitle">
                        Echa un vistazo a la calidad de nuestros productos.
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
                                <img src={item.image} alt={item.caption} />
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
