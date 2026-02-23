/**
 * useScrollReveal.js
 * Custom hook para agregar animaciones "reveal on scroll" usando IntersectionObserver.
 * 
 * Uso en componente:
 *   const ref = useScrollReveal();
 *   <section ref={ref} className="reveal">...</section>
 * 
 * CSS requerido en animations.css:
 *   .reveal { opacity: 0; transform: translateY(24px); transition: ... }
 *   .reveal.is-visible { opacity: 1; transform: translateY(0); }
 */

import { useEffect, useRef } from 'react';

/**
 * @param {Object} options - Opciones del IntersectionObserver
 * @param {number} [options.threshold=0.15] - % de visibilidad para disparar la animación
 * @param {string} [options.rootMargin='0px'] - Margen alrededor del viewport
 * @returns {React.RefObject} - Ref a aplicar al elemento a animar
 */
export const useScrollReveal = (options = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Una vez visible, deja de observar para no repetir la animación
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: options.threshold ?? 0.15,
                rootMargin: options.rootMargin ?? '0px',
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin]);

    return ref;
};
