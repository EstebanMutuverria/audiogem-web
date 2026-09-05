/**
 * products-categories.js
 * Categorías y constantes relacionadas para productos de audio vehicular.
 */

import CATEGORY_NAMES from '../constants/category_names.js';
import BADGE_NAMES from '../constants/badge_names.js';
import BRAND_NAMES from '../constants/brand_names.js';
import icon_categories from '../assets/icon-productsdata-categories/Success.png';

export const CATEGORIES = [
    {
        id: CATEGORY_NAMES.ESTEREOS,
        label: 'Estéreos',
        description: 'Receptores multimedia con Bluetooth, USB y pantallas táctiles.',
        icon: icon_categories,
        color: '#4895ef',
    },
    {
        id: CATEGORY_NAMES.PARLANTES,
        label: 'Parlantes',
        description: 'Altavoces coaxiales y separados para un sonido envolvente.',
        icon: icon_categories,
        color: '#4cc9f0',
    },
    {
        id: CATEGORY_NAMES.SUBWOOFERS,
        label: 'Subwoofers/Woofers',
        description: 'Graves profundos y presentes que transforman tu experiencia.',
        icon: icon_categories,
        color: '#3f37c9',
    },
    {
        id: CATEGORY_NAMES.POTENCIAS,
        label: 'Potencias',
        description: 'Amplificadores de alta potencia para un audio sin distorsión.',
        icon: icon_categories,
        color: '#ced4da',
    },
    {
        id: CATEGORY_NAMES.ACCESORIOS,
        label: 'Accesorios',
        description: 'Cables, conectores, kits de instalación y todo lo necesario.',
        icon: icon_categories,
        color: '#adb5bd',
    },
    {
        id: CATEGORY_NAMES.RACKERAS,
        label: 'Rackeras',
        description: 'Rackeras para un sonido envolvente.',
        icon: icon_categories,
        color: '#4cc9f0',
    },
    {
        id: CATEGORY_NAMES.COMPONENTES,
        label: 'Drivers/Tweeters/Medios',
        description: 'Drivers, Tweeters y Medios para un sonido de alta calidad.',
        icon: icon_categories,
        color: '#4cc953',
    },
    {
        id: CATEGORY_NAMES.CAJONES,
        label: 'Cajones',
        description: 'Cajones y recintos para subwoofers y parlantes.',
        icon: icon_categories,
        color: '#8b5cf6',
    },
];