/**
 * ElectricBorder.jsx
 * Componente de borde animado altamente optimizado.
 * Basado en React Bits, adaptado para Vite y React 18+.
 */

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import './ElectricBorder.css';

/** Detect mobile once — capped DPR and reduced sample counts. */
const IS_MOBILE = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const ElectricBorder = ({
    children,
    color = 'aqua',
    speed = 1,
    chaos = 0.12,
    borderRadius = 24,
    className = '',
    style = {}
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const timeRef = useRef(0);
    const lastFrameTimeRef = useRef(0);

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Optimizamos las funciones de ruido con useCallback
    const random = useCallback((x) => {
        return (Math.sin(x * 12.9898) * 43758.5453) % 1;
    }, []);

    const noise2D = useCallback(
        (x, y) => {
            const i = Math.floor(x);
            const j = Math.floor(y);
            const fx = x - i;
            const fy = y - j;

            const a = random(i + j * 57);
            const b = random(i + 1 + j * 57);
            const c = random(i + (j + 1) * 57);
            const d = random(i + 1 + (j + 1) * 57);

            const ux = fx * fx * (3.0 - 2.0 * fx);
            const uy = fy * fy * (3.0 - 2.0 * fy);

            return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
        },
        [random]
    );

    const octavedNoise = useCallback(
        (x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time, seed, baseFlatness) => {
            let y = 0;
            let amplitude = baseAmplitude;
            let frequency = baseFrequency;

            for (let i = 0; i < octaves; i++) {
                let octaveAmplitude = amplitude;
                if (i === 0) {
                    octaveAmplitude *= baseFlatness;
                }
                y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
                frequency *= lacunarity;
                amplitude *= gain;
            }

            return y;
        },
        [noise2D]
    );

    const getCornerPoint = useCallback((centerX, centerY, radius, startAngle, arcLength, progress) => {
        const angle = startAngle + progress * arcLength;
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    }, []);

    const getRoundedRectPoint = useCallback(
        (t, left, top, width, height, radius) => {
            const straightWidth = width - 2 * radius;
            const straightHeight = height - 2 * radius;
            const cornerArc = (Math.PI * radius) / 2;
            const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
            const distance = t * totalPerimeter;

            let accumulated = 0;

            if (distance <= accumulated + straightWidth) {
                const progress = (distance - accumulated) / straightWidth;
                return { x: left + radius + progress * straightWidth, y: top };
            }
            accumulated += straightWidth;

            if (distance <= accumulated + cornerArc) {
                const progress = (distance - accumulated) / cornerArc;
                return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
            }
            accumulated += cornerArc;

            if (distance <= accumulated + straightHeight) {
                const progress = (distance - accumulated) / straightHeight;
                return { x: left + width, y: top + radius + progress * straightHeight };
            }
            accumulated += straightHeight;

            if (distance <= accumulated + cornerArc) {
                const progress = (distance - accumulated) / cornerArc;
                return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
            }
            accumulated += cornerArc;

            if (distance <= accumulated + straightWidth) {
                const progress = (distance - accumulated) / straightWidth;
                return { x: left + width - radius - progress * straightWidth, y: top + height };
            }
            accumulated += straightWidth;

            if (distance <= accumulated + cornerArc) {
                const progress = (distance - accumulated) / cornerArc;
                return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
            }
            accumulated += cornerArc;

            if (distance <= accumulated + straightHeight) {
                const progress = (distance - accumulated) / straightHeight;
                return { x: left, y: top + height - radius - progress * straightHeight };
            }
            accumulated += straightHeight;

            const progress = (distance - accumulated) / cornerArc;
            return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
        },
        [getCornerPoint]
    );

    // Listen for prefers-reduced-motion changes
    useEffect(() => {
        const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (!mql) return;
        setPrefersReducedMotion(mql.matches);
        const handler = (e) => setPrefersReducedMotion(e.matches);
        mql.addEventListener?.('change', handler) ?? mql.addListener?.(handler);
        return () => mql.removeEventListener?.('change', handler) ?? mql.removeListener?.(handler);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // If user prefers reduced motion, render a single static frame and skip the loop
        if (prefersReducedMotion) {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const rect = container.getBoundingClientRect();
            const width = rect.width + 100;
            const height = rect.height + 100;
            const dpr = Math.min(window.devicePixelRatio || 1, 1);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Draw a simple static rounded rect
            const r = Math.min(borderRadius, Math.min(width - 100, height - 100) / 2);
            ctx.beginPath();
            ctx.roundRect(50, 50, width - 100, height - 100, r);
            ctx.stroke();
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuración de animación
        const octaves = IS_MOBILE ? 4 : 8;       // Half octaves on mobile
        const lacunarity = 1.6;
        const gain = 0.7;
        const amplitude = chaos;
        const frequency = IS_MOBILE ? 6 : 10;     // Lower frequency on mobile
        const baseFlatness = 0;
        const displacement = 45;
        const borderOffset = 50;

        // Cap DPR to 1 on mobile to avoid huge canvases
        const getDpr = () => Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1 : 2);

        const updateSize = () => {
            const rect = container.getBoundingClientRect();
            const width = rect.width + borderOffset * 2;
            const height = rect.height + borderOffset * 2;

            const dpr = getDpr();
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);

            return { width, height };
        };

        let { width, height } = updateSize();

        const drawElectricBorder = (currentTime) => {
            if (!canvas || !ctx) return;

            const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
            timeRef.current += deltaTime * speed;
            lastFrameTimeRef.current = currentTime;

            const dpr = getDpr();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.scale(dpr, dpr);

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const scale = displacement;
            const left = borderOffset;
            const top = borderOffset;
            const borderWidth = width - 2 * borderOffset;
            const borderHeight = height - 2 * borderOffset;
            const maxRadius = Math.min(borderWidth, borderHeight) / 2;
            const radius = Math.min(borderRadius, maxRadius);

            const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
            const sampleStep = IS_MOBILE ? 4 : 2;  // Wider steps on mobile
            const sampleCount = Math.floor(approximatePerimeter / sampleStep);

            ctx.beginPath();

            for (let i = 0; i <= sampleCount; i++) {
                const progress = i / sampleCount;

                const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

                const xNoise = octavedNoise(
                    progress * 8,
                    octaves,
                    lacunarity,
                    gain,
                    amplitude,
                    frequency,
                    timeRef.current,
                    0,
                    baseFlatness
                );

                const yNoise = octavedNoise(
                    progress * 8,
                    octaves,
                    lacunarity,
                    gain,
                    amplitude,
                    frequency,
                    timeRef.current,
                    1,
                    baseFlatness
                );

                const displacedX = point.x + xNoise * scale;
                const displacedY = point.y + yNoise * scale;

                if (i === 0) {
                    ctx.moveTo(displacedX, displacedY);
                } else {
                    ctx.lineTo(displacedX, displacedY);
                }
            }

            ctx.closePath();
            ctx.stroke();

            animationRef.current = requestAnimationFrame(drawElectricBorder);
        };

        // Throttled resize observer — recalculate at most once per 300ms
        let resizeTimer = null;
        const resizeObserver = new ResizeObserver(() => {
            if (resizeTimer) return;
            resizeTimer = setTimeout(() => {
                resizeTimer = null;
                const newSize = updateSize();
                width = newSize.width;
                height = newSize.height;
            }, 300);
        });
        resizeObserver.observe(container);

        // Pause animation when tab is not visible
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                    animationRef.current = null;
                }
            } else {
                lastFrameTimeRef.current = 0;
                animationRef.current = requestAnimationFrame(drawElectricBorder);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        animationRef.current = requestAnimationFrame(drawElectricBorder);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeObserver.disconnect();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [color, speed, chaos, borderRadius, prefersReducedMotion, octavedNoise, getRoundedRectPoint]);

    const vars = useMemo(() => ({
        '--electric-border-color': color,
        borderRadius: `${borderRadius}px`
    }), [color, borderRadius]);

    return (
        <div ref={containerRef} className={`electric-border ${className}`} style={{ ...vars, ...style }}>
            <div className="eb-canvas-container">
                <canvas ref={canvasRef} className="eb-canvas" />
            </div>
            <div className="eb-layers">
                <div className="eb-glow-1" />
                <div className="eb-glow-2" />
                <div className="eb-background-glow" />
            </div>
            <div className="eb-content">{children}</div>
        </div>
    );
};

export default ElectricBorder;
