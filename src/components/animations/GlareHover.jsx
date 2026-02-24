/**
 * GlareHover.jsx
 * Componente de efecto de brillo (glare) optimizado para botones y tarjetas.
 */

import { useMemo } from 'react';
import './GlareHover.css';

const GlareHover = ({
    children,
    glareColor = '#ffffff',
    glareOpacity = 0.3,
    glareAngle = -30,
    glareSize = 300,
    transitionDuration = 650,
    playOnce = false,
    className = '',
    style = {}
}) => {
    // Optimizamos la conversión de color con useMemo
    const rgba = useMemo(() => {
        const hex = glareColor.replace('#', '');
        if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
        } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
        }
        return glareColor;
    }, [glareColor, glareOpacity]);

    const vars = useMemo(() => ({
        '--gh-angle': `${glareAngle}deg`,
        '--gh-duration': `${transitionDuration}ms`,
        '--gh-size': `${glareSize}%`,
        '--gh-rgba': rgba,
    }), [glareAngle, transitionDuration, glareSize, rgba]);

    return (
        <div
            className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
            style={{ ...vars, ...style }}
        >
            <div className="glare-hover__content">
                {children}
            </div>
        </div>
    );
};

export default GlareHover;
