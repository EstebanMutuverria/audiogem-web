/**
 * Button.jsx
 * Botón reutilizable con variantes: primary, secondary, ghost.
 * Puede renderizarse como <button> o como <Link> de React Router.
 */

import { Link } from 'react-router-dom';
import './Button.css';
import GlareHover from '../animations/GlareHover';

/**
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.to] - Si se pasa, renderiza como Link interno
 * @param {string} [props.href] - Si se pasa, renderiza como <a> externo
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    to,
    href,
    children,
    className = '',
    ...rest
}) => {
    const sizePadding = {
        sm: 'var(--spacing-2) var(--spacing-4)',
        md: 'var(--spacing-3) var(--spacing-6)',
        lg: 'var(--spacing-4) var(--spacing-8)',
    }[size];

    const content = variant === 'primary' ? (
        <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.4}
            glareSize={200}
            transitionDuration={800}
            style={{ padding: sizePadding }}
        >
            {children}
        </GlareHover>
    ) : children;

    const classes = [
        'btn',
        `btn--${variant}`,
        size !== 'md' ? `btn--${size}` : '',
        variant === 'primary' ? 'btn--has-glare' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    if (to) {
        return (
            <Link to={to} className={classes} {...rest}>
                {content}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} target="_blank" rel="noreferrer" {...rest}>
                {content}
            </a>
        );
    }

    return (
        <button className={classes} {...rest}>
            {content}
        </button>
    );
};

export default Button;
