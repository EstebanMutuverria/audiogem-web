/**
 * productsData.js
 * Capa de datos mock para productos de audio vehicular.
 * Para conectar a un backend real, reemplazá este archivo con llamadas fetch()
 * sin necesidad de tocar ningún componente.
 */

import estereo_b52 from '../assets/products_section_pictures/estereo_b52-rm-2025bt.jpeg';
import rackera_2y2_para_pote from '../assets/products_section_pictures/rackera-2y2-para-pote.jpeg';
import pote_taramps_400x4 from '../assets/products_section_pictures/pote_taramps_400x4.jpeg';
import estereo_crown_mustang from '../assets/products_section_pictures/estereo-crown-mustang.jpeg'
import estereo_infinity_tech from '../assets/products_section_pictures/estereo-infinity-tech.jpeg'
import estereo_philco from '../assets/products_section_pictures/estereo-philco.jpeg'
import rackera_2medios_2super from '../assets/products_section_pictures/rackera-2medios-2supertweeter.jpeg'
import rackera_4drivers5041 from '../assets/products_section_pictures/rackera-4drivers5041.jpeg'
import rackera_curva_completa_estereo from '../assets/products_section_pictures/rackera-curva-completa-estereo.jpeg'
import rackera_2driver_2bomber_2tweeter from '../assets/products_section_pictures/rackera-2driver-2bomber-2tweeter.jpeg'
import kit_instalacion_infinity_tech from '../assets/products_section_pictures/kit-de-cables-infinity-4g.jpeg'
import rackera_2y2_chica from '../assets/products_section_pictures/rackera-2y2-chica.jpeg'
import rackera_2driver_26x9pioneer from '../assets/products_section_pictures/rackera-2driver-26x9pioneer.jpeg'
import rackera_2parlantes_2tweeter_jahro from '../assets/products_section_pictures/rackera-2parlantes-2tweeter-jahro.jpeg'
import super_tweeter_blauline from '../assets/products_section_pictures/supertweeter-blauline.jpeg'
import cable_y_griega from '../assets/products_section_pictures/cable-y-griega.jpeg'
import capacitores_tweeter from '../assets/products_section_pictures/capacitores-tweeter.jpeg'
import capacitores_driver from '../assets/products_section_pictures/capacitores-driver.jpeg'
import difusores_de_aluminio from '../assets/products_section_pictures/difusores-de-aluminio.jpeg'
import pote_taramps_800x4 from '../assets/products_section_pictures/pote-taramps-800x4.jpeg'
import medios_de_8_jahro from '../assets/products_section_pictures/medios-de-8-jahro.jpeg'
import driver_jbl_250 from '../assets/products_section_pictures/driver-jbl-250.jpeg'
import difusores_de_plastico_cortos from '../assets/products_section_pictures/difusores-de-plastico-cortos.jpeg'
import subwoofer_pioneer_12p from '../assets/products_section_pictures/subwoofer-pioneer-12p.jpeg'
import rackera_curva_completa_para_pote_bala from '../assets/products_section_pictures/rackera-curva-completa-para-pote-bala.jpeg'
import parlantes_bomber_6x9_con_caja from '../assets/products_section_pictures/parlantes-bomber-6x9-con-caja.jpeg'
import parlantes_jahro_6p from '../assets/products_section_pictures/parlantes-jahro-6p.jpeg'
import parlantes_jahro_5p from '../assets/products_section_pictures/parlantes-jahro-5p.jpeg'
import parlantes_jahro_4p from '../assets/products_section_pictures/parlantes-jahro-4p.jpeg'
import medios_de_6_jahro from '../assets/products_section_pictures/medios-de-6-jahro.jpeg'
import driver_jahro_5041 from '../assets/products_section_pictures/driver-jahro-5041.jpeg'
import driver_jbl_trio from '../assets/products_section_pictures/driver-jbl-trio.jpeg'
import controles_stetsom from '../assets/products_section_pictures/controles-stetsom.jpeg'
import tweeter_jbl_st400_trio from '../assets/products_section_pictures/tweeter-jbl-st400-trio.jpeg'
import tweeter_jbl_st200 from '../assets/products_section_pictures/tweeter-jbl-st200.jpeg'
import woofer_12p_triton from '../assets/products_section_pictures/woofer-12p-triton.jpeg'
import woofer_12p_triton_850rms from '../assets/products_section_pictures/woofer-12p-triton-850rms.jpeg'
import driver_jahro_5042 from '../assets/products_section_pictures/driver-jahro-5042.jpeg'
import pote_sound_digital_400x4 from '../assets/products_section_pictures/pote-sound-digital-400x4.jpeg'
import pote_sound_digital_800x4 from '../assets/products_section_pictures/pote-sound-digital-800x4.jpeg'


import icon_categories from '../assets/icon-productsdata-categories/Success.png'

export const CATEGORIES = [
    {
        id: 'estereos',
        label: 'Estéreos',
        description: 'Receptores multimedia con Bluetooth, USB y pantallas táctiles.',
        icon: icon_categories,
        color: '#4895ef',
    },
    {
        id: 'parlantes',
        label: 'Parlantes',
        description: 'Altavoces coaxiales y separados para un sonido envolvente.',
        icon: icon_categories,
        color: '#4cc9f0',
    },
    {
        id: 'subwoofers',
        label: 'Subwoofers/Woofers',
        description: 'Graves profundos y presentes que transforman tu experiencia.',
        icon: icon_categories,
        color: '#3f37c9',
    },
    {
        id: 'potencias',
        label: 'Potencias',
        description: 'Amplificadores de alta potencia para un audio sin distorsión.',
        icon: icon_categories,
        color: '#ced4da',
    },
    {
        id: 'accesorios',
        label: 'Accesorios',
        description: 'Cables, conectores, kits de instalación y todo lo necesario.',
        icon: icon_categories,
        color: '#adb5bd',
    },
    {
        id: 'rackeras',
        label: 'Rackeras',
        description: 'Rackeras para un sonido envolvente.',
        icon: icon_categories,
        color: '#4cc9f0',
    },
    {
        id: 'componentes',
        label: 'Drivers/Tweeters/Medios',
        description: 'Drivers, Tweeters y Medios para un sonido de alta calidad.',
        icon: icon_categories,
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
        name: 'Tweeter JBL ST400 Trio',
        category: 'componentes',
        brand: 'JBL',
        image: tweeter_jbl_st400_trio,
        description: 'Tweeter JBL ST400 Trio de 200w rms',
        badge: 'Top Calidad',
        price: '$110.000'
    },
    {
        id: 5,
        name: 'Driver JBL D250-X',
        category: 'componentes',
        brand: 'JBL',
        image: driver_jbl_250,
        description: 'Driver JBL D250-X',
        badge: 'Recomendado',
        price: '$80.000'
    },
    {
        id: 6,
        name: 'Rackera 2 driver y 2 tweeters Jahro',
        category: 'rackeras',
        brand: 'Jharo',
        image: rackera_2y2_chica,
        description: 'Rackera 2 drivers Jahro 5041 de 150 watts y 2 tweeters Jahro',
        badge: 'Más vendido',
        price: '$80.000'
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
        name: 'Rackera 2 medios de 8 pulgadas y 2 super tweeters Jahro',
        category: 'rackeras',
        brand: 'Jahro',
        image: rackera_2medios_2super,
        description: 'Rackera 2 medios de 8 pulgadas marca Jahro y 2 super tweeters Jahro',
        badge: null,
        price: '$140.000'
    },
    {
        id: 9,
        name: 'Rackera 4 drivers Jahro 5041',
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
        name: 'Estereo philco CSP2950BT',
        category: 'estereos',
        brand: 'Philco',
        image: estereo_philco,
        description: 'Estereo Philco con Bluetooth, USB, Manos Libres',
        badge: 'Nuevo',
        price: '$60.000'
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
        name: 'Medio de 8 pulgadas Jahro',
        category: 'componentes',
        brand: 'Jahro',
        image: medios_de_8_jahro,
        description: 'Medio de 8 pulgadas marca Jahro',
        badge: null,
        price: '$32.000'
    },
    {
        id: 23,
        name: 'Estereo Infinity Tech',
        category: 'estereos',
        brand: 'Infinity Tech',
        image: estereo_infinity_tech,
        description: 'Estereo Infinity Tech con Bluetooth, USB, MP3',
        badge: 'Oferta',
        price: '$40.000'
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
        name: 'Subwoofer Pioneer 12 pulgadas',
        category: 'subwoofers',
        brand: 'Pioneer',
        image: subwoofer_pioneer_12p,
        description: 'Subwoofer Pioneer 12 pulgadas doble bobina TS-W312D4 1600w Max / 500w RMS',
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
        name: 'Parlantes Jahro 6 pulgadas (el par)',
        category: 'parlantes',
        brand: 'Jahro',
        image: parlantes_jahro_6p,
        description: 'Parlantes Jahro 6 pulgadas',
        badge: 'Oferta',
        price: '$30.000'
    },
    {
        id: 29,
        name: 'Parlantes Jahro 5 pulgadas (el par)',
        category: 'parlantes',
        brand: 'Jahro',
        image: parlantes_jahro_5p,
        description: 'Parlantes Jahro 5 pulgadas',
        badge: null,
        price: '$29.000'
    },
    {
        id: 30,
        name: 'Parlantes Jahro 4 pulgadas (el par)',
        category: 'parlantes',
        brand: 'Jahro',
        image: parlantes_jahro_4p,
        description: 'Parlantes Jahro 4 pulgadas',
        badge: null,
        price: '$28.000'
    },
    {
        id: 31,
        name: 'Medios de 6" Jahro',
        category: 'componentes',
        brand: 'Jahro',
        image: medios_de_6_jahro,
        description: 'Medios de 6" marca Jahro',
        badge: null,
        price: '$27.000'
    },
    {
        id: 32,
        name: 'Driver Jahro 5041',
        category: 'componentes',
        brand: 'Jahro',
        image: driver_jahro_5041,
        description: 'Driver Jahro 5041 de 150 watts',
        badge: null,
        price: '$22.000'
    },
    {
        id: 33,
        name: 'Driver JBL Trio',
        category: 'componentes',
        brand: 'JBL',
        image: driver_jbl_trio,
        description: 'Driver JBL D250 Trio de 200w rms',
        badge: 'Top Calidad',
        price: '$135.000'
    },
    {
        id: 34,
        name: 'Controlador de Sonido Stetsom',
        category: 'accesorios',
        brand: 'Stetsom',
        image: controles_stetsom,
        description: 'Controlador de Sonido Stetsom',
        badge: 'Nuevo',
        price: '$50.000'
    },
    {
        id: 36,
        name: 'Tweeter JBL ST200',
        category: 'componentes',
        brand: 'JBL',
        image: tweeter_jbl_st200,
        description: 'Tweeter JBL ST200 de 100w rms',
        badge: null,
        price: '$55.000'
    },
    {
        id: 35,
        name: 'Estereo Crown Mustang DMR-3000BT',
        category: 'estereos',
        brand: 'Crown Mustang',
        image: estereo_crown_mustang,
        description: 'Estereo Crown Mustang con Bluetooth, USB, MP3',
        badge: null,
        price: '$65.000'
    },
    {
        id: 37,
        name: 'Woofer Triton 12 Pulgadas 620rms',
        category: 'subwoofers',
        brand: 'Triton',
        image: woofer_12p_triton,
        description: 'Woofer Triton 12 Pulgadas TR 620 8 ohm 620w Rms 1240w pmpo',
        badge: null,
        price: '$250.000'
    },
    {
        id: 38,
        name: 'Woofer Triton 12 Pulgadas 850rms',
        category: 'subwoofers',
        brand: 'Triton',
        image: woofer_12p_triton_850rms,
        description: 'Woofer Triton Medio Grave 850w Rms 8 Ohm Tr 850 Negro',
        badge: null,
        price: '$340.000'
    },
    {
        id: 39,
        name: 'Driver Jahro 5042 200w MAX',
        category: 'componentes',
        brand: 'Jahro',
        image: driver_jahro_5042,
        description: 'Driver Jahro 5042 250 watts max 400w Rms',
        badge: null,
        price: '$47.000'
    },
    {
        id: 40,
        name: 'Potencia Sound Digital 400x4',
        category: 'potencias',
        brand: 'Sound Digital',
        image: pote_sound_digital_400x4,
        description: 'Potencia Sound Digital 400x4 400w Rms 4 canales',
        badge: null,
        price: '$100.000'
    },
    {
        id: 41,
        name: 'Potencia Sound Digital 800x4',
        category: 'potencias',
        brand: 'Sound Digital',
        image: pote_sound_digital_800x4,
        description: 'Potencia Sound Digital 800x4 800w Rms 4 canales',
        badge: null,
        price: '$170.000'
    },
];
