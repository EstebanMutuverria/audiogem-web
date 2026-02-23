/**
 * productsData.js
 * Capa de datos mock para productos de audio vehicular.
 * Para conectar a un backend real, reemplazá este archivo con llamadas fetch()
 * sin necesidad de tocar ningún componente.
 */

import estereo_b52 from '../assets/estereo_b52-rm-2025bt.jpeg';
import rackera_2y2_para_pote from '../assets/rackera-2y2-para-pote.jpeg';
import pote_taramps_400x4 from '../assets/pote_taramps_400x4.jpeg';
import estereo_crown_mustang from '../assets/estereo-crown-mustang.jpeg'
import estereo_infinity_tech from '../assets/estereo-infinity-tech.jpeg'
import estereo_philco from '../assets/estereo-philco.jpeg'
import rackera_2medios_2super from '../assets/rackera-2medios-2supertweeter.jpeg'
import rackera_4drivers5041 from '../assets/rackera-4drivers5041.jpeg'
import rackera_curva_completa_estereo from '../assets/rackera-curva-completa-estereo.jpeg'
import rackera_2driver_2bomber_2tweeter from '../assets/rackera-2driver-2bomber-2tweeter.jpeg'
import kit_instalacion_infinity_tech from '../assets/kit-de-cables-infinity-4g.jpeg'
import rackera_2y2_chica from '../assets/rackera-2y2-chica.jpeg'
import rackera_2driver_26x9pioneer from '../assets/rackera-2driver-26x9pioneer.jpeg'
import rackera_2parlantes_2tweeter_jahro from '../assets/rackera-2parlantes-2tweeter-jahro.jpeg'


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
    {
        id: 'rackeras',
        label: 'Rackeras',
        description: 'Rackeras para un sonido envolvente.',
        icon: '🎛️',
        color: '#4cc9f0',
    },
    {
        id: 'componentes',
        label: 'Componentes',
        description: 'Componentes para un sonido de alta calidad.',
        icon: '📯',
        color: '#4cc953',
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
        price: '$70.000'
    },
    {
        id: 2,
        name: 'Rackera 2 drivers y 2 tweeters',
        category: 'rackeras',
        brand: 'Jharo',
        image: rackera_2y2_para_pote,
        description: 'Rackera 2 drivers Jahro 250 watts y 2 super tweeters Jahro',
        badge: 'Más vendido',
        price: '$160.000'
    },
    {
        id: 3,
        name: 'Taramps 400.4',
        category: 'potencias',
        brand: 'Taramps',
        image: pote_taramps_400x4,
        description: 'Potencia Taramps 400x4 4 canales 400 watts RMS',
        badge: 'Oferta',
        price: '$110.000'
    },
    {
        id: 4,
        name: 'Estereo Crown Mustang DMR-3000BT',
        category: 'estereos',
        brand: 'Crown Mustang',
        image: estereo_crown_mustang,
        description: 'Estereo Crown Mustang con Bluetooth, USB, MP3',
        badge: null,
        price: '$65.000'
    },
    {
        id: 5,
        name: 'Estereo Infinity Tech',
        category: 'estereos',
        brand: 'Infinity Tech',
        image: estereo_infinity_tech,
        description: 'Estereo Infinity Tech con Bluetooth, USB, MP3',
        badge: 'Oferta',
        price: '$40.000'
    },
    {
        id: 6,
        name: 'Estereo philco CSP2950BT',
        category: 'estereos',
        brand: 'Philco',
        image: estereo_philco,
        description: 'Estereo Philco con Bluetooth, USB, Manos Libres',
        badge: 'Nuevo',
        price: '$60.000'
    },
];

export const ALL_PRODUCTS = [
    ...FEATURED_PRODUCTS,
    /*     {
            id: 7,
            name: 'Sony XAV-AX5500',
            category: 'estereos',
            brand: 'Sony',
            image: null,
            description: 'Pantalla táctil de 6.95" con Apple CarPlay, Android Auto, WebLink Cast y Bluetooth.',
            badge: null,
        }, */
    {
        id: 8,
        name: 'Rackera 2 medios de 8" y 2 super tweeters Jahro',
        category: 'rackeras',
        brand: 'Jahro',
        image: rackera_2medios_2super,
        description: 'Rackera 2 medios de 8" marca Jahro y 2 super tweeters Jahro',
        badge: null,
        price: '$140.000'
    },
    {
        id: 9,
        name: 'Rackera 4 drivers Jahro 5041"',
        category: 'rackeras',
        brand: 'Jahro',
        image: rackera_4drivers5041,
        description: 'Rackera 4 drivers Jahro 5041 de 150 watts',
        badge: null,
        price: '$125.000'
    },
    {
        id: 10,
        name: 'Rackera 2 drivers, 2 medios y 2 tweeters',
        category: 'rackeras',
        brand: 'Jahro',
        image: rackera_curva_completa_estereo,
        description: 'Rackera 2 drivers, 2 medios y 2 tweeters marca Jahro',
        badge: 'Más vendido',
        price: '$170.000'
    },
    {
        id: 11,
        name: 'Kit instalación Infinity Tech 4 GA',
        category: 'accesorios',
        brand: 'Infinity Tech',
        image: kit_instalacion_infinity_tech,
        description: 'Kit de cableado completo calibre 4 GA. Incluye cable de poder, tierra, señal RCA y fusible.',
        badge: null,
        price: '$25.000'
    },
    {
        id: 12,
        name: 'Rackera 2 drivers, 2 parlantes y 2 tweeters',
        category: 'rackeras',
        brand: 'Bomber',
        image: rackera_2driver_2bomber_2tweeter,
        description: 'Rackera 2 drivers Jahro, 2 parlantes Bomber de 6" y 2 tweeters marca Jahro',
        badge: 'Oferta',
        price: '$75.000'
    },
    {
        id: 13,
        name: 'Rackera 2 driver y 2 tweeters Jahro',
        category: 'rackeras',
        brand: 'Jharo',
        image: rackera_2y2_chica,
        description: 'Rackera 2 drivers Jahro 5041 de 150 watts y 2 tweeters Jahro',
        badge: 'Más vendido',
        price: '$80.000'
    },
    {
        id: 14,
        name: 'Rackera 2 drivers y 2 parlantes 6x9 Pioneer',
        category: 'rackeras',
        brand: 'Pioneer',
        image: rackera_2driver_26x9pioneer,
        description: 'Rackera 2 drivers Jahro 5041 de 150 watts y 2 parlantes Pioneer 6x9',
        badge: null,
        price: '$160.000'
    },
    {
        id: 15,
        name: 'Rackera 2 parlantes Jahro y 2 tweeters Jahro',
        category: 'rackeras',
        brand: 'Jahro',
        image: rackera_2parlantes_2tweeter_jahro,
        description: 'Rackera 2 parlantes de 6" marca Jahro y 2 tweeters marca Jahro',
        badge: null,
        price: '$80.000'
    },
];
