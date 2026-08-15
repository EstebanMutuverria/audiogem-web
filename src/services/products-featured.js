/**
 * products-featured.js
 * Productos destacados para la sección principal.
 * Derivados de ALL_PRODUCTS para mantener la fuente única de verdad.
 */

import { ALL_PRODUCTS } from './products-all.js';

export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(product => product.isFeatured);