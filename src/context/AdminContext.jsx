/**
 * AdminContext.jsx
 * Contexto global para gestionar la autenticación del administrador.
 * La sesión se persiste en localStorage: sobrevive al cierre de la pestaña
 * y del navegador. Solo se borra explícitamente con "Salir Admin" o si el
 * usuario limpia los datos del navegador.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import ENVIRONMENT from '../environment/environment.js';

const AdminContext = createContext(null);

const SESSION_KEY = 'audiogem_admin_auth';

export const AdminProvider = ({ children }) => {
    // Inicializar desde localStorage para mantener sesión entre visitas
    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem(SESSION_KEY) === 'true';
    });

    /**
     * Intenta autenticar al admin comparando la contraseña con la variable de entorno.
     * @returns {boolean} true si la contraseña es correcta
     */
    const login = useCallback((password) => {
        const adminPassword = ENVIRONMENT.VITE_CLAVE_ADMIN;
        if (password === adminPassword) {
            setIsAdmin(true);
            localStorage.setItem(SESSION_KEY, 'true');
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAdmin(false);
        localStorage.removeItem(SESSION_KEY);
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

/**
 * Hook para consumir el contexto admin.
 * Uso: const { isAdmin, login, logout } = useAdmin();
 */
export const useAdmin = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error('useAdmin debe usarse dentro de <AdminProvider>');
    return ctx;
};
