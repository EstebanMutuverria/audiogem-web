/**
 * combos.js
 * Servicio de persistencia para combos de administración.
 * Usa localStorage con la key `audiogem_combos` para CRUD básico.
 */

const STORAGE_KEY = 'audiogem_combos';

/**
 * Carga todos los combos almacenados en localStorage.
 * @returns {Array} Lista de combos, o array vacío si no hay datos o hay error.
 */
export function loadCombos() {
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
 * Escribe la lista completa de combos a localStorage.
 * @param {Array} combos - Lista de combos a persistir.
 * @returns {boolean} true si se guardó correctamente, false en caso contrario.
 */
export function saveCombos(combos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combos));
        return true;
    } catch {
        return false;
    }
}

/**
 * Agrega un combo a la lista persistida.
 * @param {Object} combo - Combo a agregar (debe incluir un campo `id` único).
 * @returns {Array|null} Lista actualizada de combos, o null si falló.
 */
export function addCombo(combo) {
    try {
        const combos = loadCombos();
        combos.push(combo);
        return saveCombos(combos) ? combos : null;
    } catch {
        return null;
    }
}

/**
 * Elimina un combo por su ID.
 * @param {string} id - ID del combo a eliminar.
 * @returns {Array|null} Lista actualizada de combos, o null si falló.
 */
export function deleteCombo(id) {
    try {
        const combos = loadCombos();
        const filtered = combos.filter((c) => c.id !== id);
        return saveCombos(filtered) ? filtered : null;
    } catch {
        return null;
    }
}
