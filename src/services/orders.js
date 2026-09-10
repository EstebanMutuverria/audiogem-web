/**
 * orders.js
 * Servicio de persistencia para pedidos de compra a proveedor.
 * Usa localStorage con la key `audiogem_orders` para CRUD básico.
 */

const STORAGE_KEY = 'audiogem_orders';

/**
 * Carga todos los pedidos almacenados en localStorage.
 * @returns {Array} Lista de pedidos, o array vacío si no hay datos o hay error.
 */
export function loadOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/**
 * Escribe la lista completa de pedidos a localStorage.
 * @param {Array} orders - Lista de pedidos a persistir.
 * @returns {boolean} true si se guardó correctamente, false en caso contrario.
 */
export function saveOrders(orders) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        return true;
    } catch {
        return false;
    }
}

/**
 * Agrega un pedido a la lista persistida.
 * @param {Object} order - Pedido a agregar (debe incluir un campo `id` único).
 * @returns {Array|null} Lista actualizada de pedidos, o null si falló.
 */
export function addOrder(order) {
    try {
        const orders = loadOrders();
        orders.push(order);
        return saveOrders(orders) ? orders : null;
    } catch {
        return null;
    }
}

/**
 * Elimina un pedido por su ID.
 * @param {string} id - ID del pedido a eliminar.
 * @returns {Array|null} Lista actualizada de pedidos, o null si falló.
 */
export function deleteOrder(id) {
    try {
        const orders = loadOrders();
        const filtered = orders.filter((o) => o.id !== id);
        return saveOrders(filtered) ? filtered : null;
    } catch {
        return null;
    }
}