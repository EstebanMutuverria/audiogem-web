/**
 * AdminLoginModal.jsx
 * Modal de autenticación para el administrador.
 * Se cierra al autenticarse correctamente o al hacer click fuera.
 */

import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './AdminLoginModal.css';

const AdminLoginModal = ({ isOpen, onClose }) => {
    const { login } = useAdmin();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const inputRef = useRef(null);

    // Enfocar el input al abrir
    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError('');
            setShowPassword(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(password);
        if (success) {
            onClose();
        } else {
            setError('Contraseña incorrecta. Intentá nuevamente.');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setPassword('');
            inputRef.current?.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="admin-modal__overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
        >
            <div className={`admin-modal__panel ${isShaking ? 'admin-modal__panel--shake' : ''}`}>
                {/* Icono */}
                <div className="admin-modal__icon" aria-hidden="true">
                    🔐
                </div>

                <h2 className="admin-modal__title" id="admin-modal-title">
                    Acceso Administrador
                </h2>
                <p className="admin-modal__subtitle">
                    Ingresá la contraseña para navegar como Administrador.
                </p>

                <form onSubmit={handleSubmit} className="admin-modal__form" noValidate>
                    <div className="admin-modal__field">
                        <label htmlFor="admin-password" className="admin-modal__label">
                            Contraseña
                        </label>
                        <div className="admin-modal__input-wrapper">
                            <input
                                ref={inputRef}
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className={`admin-modal__input ${error ? 'admin-modal__input--error' : ''}`}
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="admin-modal__toggle-pw"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {error && (
                            <p className="admin-modal__error" role="alert">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="admin-modal__submit"
                        disabled={!password}
                    >
                        Ingresar
                    </button>
                </form>

                <button
                    className="admin-modal__close"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default AdminLoginModal;
