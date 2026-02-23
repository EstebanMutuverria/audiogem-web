/**
 * productsData.js
 * Capa de datos mock para productos de audio vehicular.
 * Para conectar a un backend real, reemplazá este archivo con llamadas fetch()
 * sin necesidad de tocar ningún componente.
 */

import estereo_b52 from '../assets/estereo_b52-rm-2025bt.jpeg';

export const CATEGORIES = [
    {
        id: 'estereos',
        label: 'Estéreos',
        description: 'Receptores multimedia con Bluetooth, USB y pantallas táctiles.',
        icon: '🎵',
        color: '#4895ef',
    },
    {
        id: 'parlantes',
        label: 'Parlantes',
        description: 'Altavoces coaxiales y separados para un sonido envolvente.',
        icon: '🔊',
        color: '#4cc9f0',
    },
    {
        id: 'subwoofers',
        label: 'Subwoofers',
        description: 'Graves profundos y presentes que transforman tu experiencia.',
        icon: '💥',
        color: '#3f37c9',
    },
    {
        id: 'potencias',
        label: 'Potencias',
        description: 'Amplificadores de alta potencia para un audio sin distorsión.',
        icon: '⚡',
        color: '#ced4da',
    },
    {
        id: 'accesorios',
        label: 'Accesorios',
        description: 'Cables, conectores, kits de instalación y todo lo necesario.',
        icon: '🔧',
        color: '#adb5bd',
    },
];

export const FEATURED_PRODUCTS = [
    {
        id: 1,
        name: 'B52 RM-2025BT 4x25 watts',
        category: 'estereos',
        brand: 'B52',
        image: estereo_b52,
        description: 'Receptor de audio digital con Bluetooth.',
        badge: 'Más vendido',
    },
    {
        id: 2,
        name: 'JL Audio C2-650',
        category: 'parlantes',
        brand: 'JL Audio',
        image: null,
        description: 'Altavoces coaxiales de 6.5" con tweeter de seda. Respuesta en frecuencia excepcional para su tamaño.',
        badge: 'Top calidad',
    },
    {
        id: 3,
        name: 'Kenwood KFC-XW1200F',
        category: 'subwoofers',
        brand: 'Kenwood',
        image: null,
        description: 'Subwoofer de 12" con potencia máxima de 1200W. Graves profundos con una instalación sencilla.',
        badge: 'Oferta',
    },
    {
        id: 4,
        name: 'Rockford Fosgate R500X1D',
        category: 'potencias',
        brand: 'Rockford Fosgate',
        image: null,
        description: 'Amplificador monocanal Clase D de 500W RMS. Ideal para alimentar subwoofers exigentes.',
        badge: 'Premium',
    },
    {
        id: 5,
        name: 'Alpine UTE-73BT',
        category: 'estereos',
        brand: 'Alpine',
        image: null,
        description: 'Receptor de audio digital con Bluetooth, Apple CarPlay y Android Auto inalámbrico.',
        badge: 'Nuevo',
    },
    {
        id: 6,
        name: 'JBL Stage 3 8023',
        category: 'parlantes',
        brand: 'JBL',
        image: null,
        description: 'Altavoces de 8" para puerta trasera. Diseñados para reproducir medios y agudos con claridad.',
        badge: null,
    },
];

export const ALL_PRODUCTS = [
    ...FEATURED_PRODUCTS,
    {
        id: 7,
        name: 'Sony XAV-AX5500',
        category: 'estereos',
        brand: 'Sony',
        image: null,
        description: 'Pantalla táctil de 6.95" con Apple CarPlay, Android Auto, WebLink Cast y Bluetooth.',
        badge: null,
    },
    {
        id: 8,
        name: 'Focal Access 165 A1',
        category: 'parlantes',
        brand: 'Focal',
        image: null,
        description: 'Sistema de 2 vías separadas de 6.5". Cono de fibra de vidrio tejida y tweeter de aluminio/magnesio.',
        badge: 'Premium',
    },
    {
        id: 9,
        name: 'Kicker CompRT 10"',
        category: 'subwoofers',
        brand: 'Kicker',
        image: null,
        description: 'Subwoofer delgado de 10" ideal para instalaciones donde el espacio es limitado. 400W RMS.',
        badge: null,
    },
    {
        id: 10,
        name: 'Alpine MRX-M110',
        category: 'potencias',
        brand: 'Alpine',
        image: null,
        description: 'Amplificador monocanal de 1100W RMS con tecnología High Current. Eficiencia Clase D.',
        badge: null,
    },
    {
        id: 11,
        name: 'Kit instalación 4 GA',
        category: 'accesorios',
        brand: 'Stinger',
        image: null,
        description: 'Kit de cableado completo calibre 4 GA. Incluye cable de poder, tierra, señal RCA y fusible.',
        badge: null,
    },
    {
        id: 12,
        name: 'Cable RCA Prolink 5m',
        category: 'accesorios',
        brand: 'Monster',
        image: null,
        description: 'Cable RCA de alta fidelidad, blindaje doble para eliminar interferencias. 5 metros.',
        badge: null,
    },
];
