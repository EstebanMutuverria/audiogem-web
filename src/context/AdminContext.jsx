/**
 * AdminContext.jsx
 * Contexto global para gestionar la autenticación del administrador.
 * La sesión se persiste en sessionStorage: dura mientras el tab esté abierto.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

const SESSION_KEY = 'audiogem_admin_auth';

export const AdminProvider = ({ children }) => {
    // Inicializar desde sessionStorage para mantener sesión al navegar
    const [isAdmin, setIsAdmin] = useState(() => {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    });

    /**
     * Intenta autenticar al admin comparando la contraseña con la variable de entorno.
     * @returns {boolean} true si la contraseña es correcta
     */
    const login = useCallback((password) => {
        const adminPassword = import.meta.env.VITE_CLAVE_ADMIN;
        if (password === adminPassword) {
            setIsAdmin(true);
            sessionStorage.setItem(SESSION_KEY, 'true');
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAdmin(false);
        sessionStorage.removeItem(SESSION_KEY);
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
