/**
 * AdminPage.jsx
 * Shell de administración. Reutiliza el RootLayout (Navbar/Footer) y agrega
 * un encabezado propio de admin con el contenido de la sección activa.
 */

import { Outlet } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    return (
        <div className="admin-page">
            <header className="admin-page__header">
                <div className="admin-page__container">
                    <span className="admin-page__label">Panel de administración</span>
                    <h1 className="admin-page__title">Presupuestos</h1>
                </div>
            </header>
            <div className="admin-page__container">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPage;
