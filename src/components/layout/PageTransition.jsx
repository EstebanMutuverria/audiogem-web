import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const PageTransition = ({ children }) => {
    const location = useLocation();

    // Configuración del grid de "cuadrados"
    // Usamos 10 columnas y 10 filas para tener 100 "azulejos"
    const columns = 10;
    const rows = 10;
    const tileCount = columns * rows;
    const tiles = Array.from({ length: tileCount });

    // Variantes para los azulejos
    const tileVariants = {
        initial: { opacity: 1, scale: 1 },
        animate: (i) => {
            const col = i % columns;
            const row = Math.floor(i / columns);
            // Efecto diagonal
            const delay = (col + row) * 0.03;
            
            return {
                opacity: 0,
                // Leve reducción de escala para dar un efecto técnico
                scale: 0.8,
                transition: {
                    duration: 0.4,
                    delay: delay,
                    ease: "easeInOut"
                }
            };
        },
        exit: (i) => {
            const col = i % columns;
            const row = Math.floor(i / columns);
            // Efecto diagonal inverso para la salida
            const delay = ((columns - col) + (rows - row)) * 0.03;

            return {
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.4,
                    delay: delay,
                    ease: "easeInOut"
                }
            };
        }
    };

    // Variantes para el contenido de la página
    const contentVariants = {
        initial: { opacity: 0, filter: 'blur(10px)', scale: 0.98 },
        animate: { 
            opacity: 1, 
            filter: 'blur(0px)',
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.3, // Esperar un poco a que empiecen a desaparecer los cuadros
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.3,
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
                    {/* Contenido real de la página */}
                    <motion.div variants={contentVariants} className="content-inner">
                        {children}
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
