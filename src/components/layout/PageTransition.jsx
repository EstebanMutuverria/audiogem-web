import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import './PageTransition.css';

const PageTransition = () => {
    const location = useLocation();
    const currentOutlet = useOutlet(); // Capturamos el elemento renderizado actual

    // Configuración del grid de "cuadrados"
    // Reducido a 5x5 (25 azulejos) para un rendimiento fluido y ultrarrápido
    const columns = 5;
    const rows = 5;
    const tileCount = columns * rows;
    const tiles = Array.from({ length: tileCount });

    // Variantes para los azulejos
    const tileVariants = {
        initial: { opacity: 1, scale: 1 },
        animate: (i) => {
            const col = i % columns;
            const row = Math.floor(i / columns);
            // Efecto diagonal optimizado para velocidad
            const delay = (col + row) * 0.02;
            
            return {
                opacity: 0,
                scale: 0.98,
                transition: {
                    duration: 0.25,
                    delay: delay,
                    ease: "easeOut" 
                }
            };
        },
        exit: (i) => {
            const col = i % columns;
            const row = Math.floor(i / columns);
            const delay = ((columns - col) + (rows - row)) * 0.02;

            return {
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.25,
                    delay: delay,
                    ease: "easeOut"
                }
            };
        }
    };

    // Variantes de contenido (Removido blur costoso para máxima fluidez)
    const contentVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.3,
                delay: 0.1, // Revelar extremadamente rápido
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className="page-transition-container">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={location.pathname}
                    className="page-content-wrapper"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {/* Renderizamos currentOutlet en lugar de children 
                        Esto congela visualmente la página vieja mientras sale */}
                    <motion.div variants={contentVariants} className="content-inner">
                        {currentOutlet}
                    </motion.div>

                    {/* Overlay del Grid de Cuadrados */}
                    <div className="sonic-pulse-overlay grid-overlay">
                        {tiles.map((_, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={tileVariants}
                                className="sonic-tile"
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Overlay sutil de scanlines persistente */}
            <div className={`tech-overlay visible`} />
        </div>
    );
};

export default PageTransition;
