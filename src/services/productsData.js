/**
 * productsData.js
 * Capa de datos mock para productos de audio vehicular.
 * Reexporta centralizadamente:
 * - products-categories.js: Categorías y constantes
 * - products-all.js: Todos los productos e imágenes de assets
 * - products-featured.js: Productos destacados (derivados de ALL_PRODUCTS)
 *
 * Para conectar a un backend real, reemplazá estas importaciones con fetch()
 * sin necesidad de tocar ningún componente.
 */

export * from './products-categories.js';
export * from './products-all.js';
export * from './products-featured.js';