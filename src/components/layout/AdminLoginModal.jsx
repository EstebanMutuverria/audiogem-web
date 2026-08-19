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
                {/* Icono de Seguridad */}
                <div className="admin-modal__icon" aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <h2 className="admin-modal__title" id="admin-modal-title">
                    Modo Admin
                </h2>
                <p className="admin-modal__subtitle">
                    Ingresá tu credencial para acceder a las funciones de administración.
                </p>

                <form onSubmit={handleSubmit} className="admin-modal__form" noValidate>
                    <div className="admin-modal__field">
                        <label htmlFor="admin-password" className="admin-modal__label">
                            Password
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
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="admin-modal__toggle-pw"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                        {error && (
                            <p className="admin-modal__error" role="alert">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="admin-modal__submit"
                        disabled={!password}
                    >
                        Validar Acceso
                    </button>
                </form>

                <button
                    className="admin-modal__close"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    );
};

export default AdminLoginModal;
