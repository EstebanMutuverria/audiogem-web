/**
 * StarBorder.jsx
 * Componente reutilizable de borde animado tipo "estrella".
 * Adaptado de React Bits para Vite + React.
 * No tiene estado interno → sin re-renders innecesarios.
 */

import './StarBorder.css';

const StarBorder = ({
    as: Tag = 'button',
    className = '',
    color = 'white',
    speed = '6s',
    thickness = 1,
    style,
    children,
    ...rest
}) => {
    const gradientStyle = {
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed,
    };

    return (
        <Tag
            className={`star-border-container ${className}`}
            style={{ padding: `${thickness}px 0`, ...style }}
            {...rest}
        >
            <div className="star-border__gradient star-border__gradient--bottom" style={gradientStyle} />
            <div className="star-border__gradient star-border__gradient--top" style={gradientStyle} />
            <div className="star-border__inner">{children}</div>
        </Tag>
    );
};

export default StarBorder;
