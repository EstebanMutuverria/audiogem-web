/**
 * TextShimmer.jsx
 * Efecto de resplandor para texto.
 * Completamente optimizado con CSS nativo, sin dependencias (0 re-renders).
 */

import { useMemo } from 'react';
import './TextShimmer.css';

const TextShimmer = ({
    children,
    as: Component = 'p',
    className = '',
    duration = 2,
    spread = 2,
}) => {
    // Calculamos el tamaño del resplandor basado en la longitud del texto
    const dynamicSpread = useMemo(() => {
        return children.length * spread;
    }, [children, spread]);

    return (
        <Component
            className={`text-shimmer ${className}`}
            style={{
                '--ts-duration': `${duration}s`,
                '--ts-spread': `${dynamicSpread}px`,
            }}
        >
            {children}
        </Component>
    );
};

export default TextShimmer;
