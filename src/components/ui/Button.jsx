/**
 * Button.jsx
 * Botón reutilizable con variantes: primary, secondary, ghost.
 * Puede renderizarse como <button> o como <Link> de React Router.
 */

import { Link } from 'react-router-dom';
import './Button.css';

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
    const classes = [
        'btn',
        `btn--${variant}`,
        size !== 'md' ? `btn--${size}` : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    if (to) {
        return (
            <Link to={to} className={classes} {...rest}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} target="_blank" rel="noreferrer" {...rest}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
};

export default Button;
