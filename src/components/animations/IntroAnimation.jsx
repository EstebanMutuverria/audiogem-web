import React, { useState, useEffect } from 'react';
import './IntroAnimation.css';

const IntroAnimation = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Bloquear scroll al iniciar
        document.body.style.overflow = 'hidden';

        // Duración total de la animación antes de empezar a salir
        const timer = setTimeout(() => {
            setIsExiting(true);
            
            // Tiempo para que termine la animación de salida (fade out)
            const exitTimer = setTimeout(() => {
                setIsVisible(false);
                // Desbloquear scroll al terminar
                document.body.style.overflow = 'auto';
            }, 800);

            return () => clearTimeout(exitTimer);
        }, 3000);

        return () => {
            clearTimeout(timer);
            // Asegurarse de desbloquear si se desmonta prematuramente
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`intro-overlay ${isExiting ? 'exit' : ''}`}>
            <div className="intro-content">
                <div className="logo-wrapper">
                    <h1 className="intro-logo">
                        <span className="char">A</span>
                        <span className="char">u</span>
                        <span className="char">d</span>
                        <span className="char">i</span>
                        <span className="char">o</span>
                        <span className="char">G</span>
                        <span className="char">e</span>
                        <span className="char">m</span>
                    </h1>
                    <div className="logo-line"></div>
                </div>
                <p className="intro-tagline">
                    Especialistas en audio vehicular
                </p>
            </div>
            
            <div className="intro-bg-elements">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
            </div>
        </div>
    );
};

export default IntroAnimation;
