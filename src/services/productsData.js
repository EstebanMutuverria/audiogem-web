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
import super_tweeter_blauline from '../assets/supertweeter-blauline.jpeg'
import cable_y_griega from '../assets/cable-y-griega.jpeg'
import capacitores_tweeter from '../assets/capacitores-tweeter.jpeg'
import capacitores_driver from '../assets/capacitores-driver.jpeg'
import difusores_de_aluminio from '../assets/difusores-de-aluminio.jpeg'
import pote_taramps_800x4 from '../assets/pote-taramps-800x4.jpeg'
import medios_de_8_jahro from '../assets/medios-de-8-jahro.jpeg'
import driver_jbl_250 from '../assets/driver-jbl-250.jpeg'
import difusores_de_plastico_cortos from '../assets/difusores-de-plastico-cortos.jpeg'
import subwoofer_pioneer_12p from '../assets/subwoofer-pioneer-12p.jpeg'
import rackera_curva_completa_para_pote_bala from '../assets/rackera-curva-completa-para-pote-bala.jpeg'
import parlantes_bomber_6x9_con_caja from '../assets/parlantes-bomber-6x9-con-caja.jpeg'
import parlantes_jahro_6p from '../assets/parlantes-jahro-6p.jpeg'
import parlantes_jahro_5p from '../assets/parlantes-jahro-5p.jpeg'
import parlantes_jahro_4p from '../assets/parlantes-jahro-4p.jpeg'


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
    {
        id: 16,
        name: 'Super Tweeter Blauline BT-304',
        category: 'componentes',
        brand: 'Blauline',
        image: super_tweeter_blauline,
        description: 'Super Tweeter Blauline 1.8 Super Bullet',
        badge: null,
        price: '$30.000'
    },
    {
        id: 17,
        name: 'Cable y Griega',
        category: 'accesorios',
        brand: null,
        image: cable_y_griega,
        description: 'Cable y Griega - 1 rca hembra a 2 rca macho',
        badge: null,
        price: '$5.000'
    },
    {
        id: 18,
        name: 'Capacitores para Tweeter',
        category: 'accesorios',
        brand: null,
        image: capacitores_tweeter,
        description: 'Capacitores para Tweeter',
        badge: null,
        price: '$2.500'
    },
    {
        id: 19,
        name: 'Capacitores para Driver',
        category: 'accesorios',
        brand: null,
        image: capacitores_driver,
        description: 'Capacitores para Driver',
        badge: null,
        price: '$2.500'
    },
    {
        id: 20,
        name: 'Difusores de Aluminio',
        category: 'accesorios',
        brand: null,
        image: difusores_de_aluminio,
        description: 'Difusores de Aluminio para Driver',
        badge: null,
        price: '$37.000'
    },
    {
        id: 21,
        name: 'Potencia Taramps 800x4',
        category: 'potencias',
        brand: 'Taramps',
        image: pote_taramps_800x4,
        description: 'Potencia Taramps 800x4 4 canales 800 watts RMS',
        badge: null,
        price: '$180.000'
    },
    {
        id: 22,
        name: 'Medio de 8" Jahro',
        category: 'componentes',
        brand: 'Jahro',
        image: medios_de_8_jahro,
        description: 'Medio de 8" marca Jahro',
        badge: null,
        price: '$32.000'
    },
    {
        id: 23,
        name: 'Driver JBL 250',
        category: 'componentes',
        brand: 'JBL',
        image: driver_jbl_250,
        description: 'Driver JBL 250',
        badge: 'Recomendado',
        price: '$80.000'
    },
    {
        id: 24,
        name: 'Difusores de Plástico Cortos',
        category: 'accesorios',
        brand: null,
        image: difusores_de_plastico_cortos,
        description: 'Difusores de Plástico Cortos',
        badge: null,
        price: '$3.800'
    },
    {
        id: 25,
        name: 'Subwoofer Pioneer 12"',
        category: 'subwoofers',
        brand: 'Pioneer',
        image: subwoofer_pioneer_12p,
        description: 'Subwoofer Pioneer 12" doble bobina TS-W312D4 1600w Max / 500w RMS',
        badge: null,
        price: '$205.000'
    },
    {
        id: 26,
        name: 'Rackera Curva 2 medios bala, 2 drivers 250 y 2 super tweeters',
        category: 'rackeras',
        brand: null,
        image: rackera_curva_completa_para_pote_bala,
        description: 'Rackera Curva 2 medios bala infinity tech, 2 drivers 250 y 2 super tweeters',
        badge: null,
        price: '$290.000'
    },
    {
        id: 27,
        name: 'Parlantes Bomber 6x9 con Cajas individuales (el par)',
        category: 'parlantes',
        brand: 'Bomber',
        image: parlantes_bomber_6x9_con_caja,
        description: 'Parlantes Bomber 6x9 75 watts rms c/u cuatriaxiales con Cajas individuales',
        badge: null,
        price: '$75.000'
    },
    {
        id: 28,
        name: 'Parlantes Jahro 6" (el par)',
        category: 'parlantes',
        brand: 'Jahro',
        image: parlantes_jahro_6p,
        description: 'Parlantes Jahro 6"',
        badge: 'Oferta',
        price: '$30.000'
    },
    {
        id: 29,
        name: 'Parlantes Jahro 5" (el par)',
        category: 'parlantes',
        brand: 'Jahro',
        image: parlantes_jahro_5p,
        description: 'Parlantes Jahro 5"',
        badge: null,
        price: '$29.000'
    },
    {
        id: 30,
        name: 'Parlantes Jahro 4" (el par)',
        category: 'parlantes',
        brand: 'Jahro',
        image: parlantes_jahro_4p,
        description: 'Parlantes Jahro 4"',
        badge: null,
        price: '$28.000'
    },
];
