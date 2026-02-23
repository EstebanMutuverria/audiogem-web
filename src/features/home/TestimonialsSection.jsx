/**
 * TestimonialsSection.jsx
 * Muestra reseñas de clientes.
 */

import { useScrollReveal } from '../../hooks/useScrollReveal';
import { TESTIMONIALS } from '../../services/testimonialsData';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
    const ref = useScrollReveal();

    return (
        <section className="testimonials reveal" ref={ref}>
            <div className="testimonials__container">
                <div className="section-header section-header--center">
                    <span className="section-label">Testimonios</span>
                    <div className="divider divider--center" />
                    <h2 className="section-title">Lo que dicen nuestros clientes</h2>
                    <p className="section-subtitle">
                        La satisfacción de quienes ya mejoraron su sonido es nuestra mejor garantía.
                    </p>
                </div>

                <div className="testimonials__grid">
                    {TESTIMONIALS.map((t) => (
                        <article key={t.id} className="testimonial-card">
                            <span className="testimonial-card__quote-icon" aria-hidden="true">”</span>

                            <div className="testimonial-card__rating">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>{i < t.rating ? '⭐' : '☆'}</span>
                                ))}
                            </div>

                            <p className="testimonial-card__content">“{t.content}”</p>

                            <div className="testimonial-card__author">
                                <div className="testimonial-card__avatar">
                                    👤
                                </div>
                                <div className="testimonial-card__info">
                                    <span className="testimonial-card__name">{t.name}</span>
                                    <span className="testimonial-card__role">{t.role}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
