/**
 * AdminPage.jsx
 * Shell de administración. Reutiliza el RootLayout (Navbar/Footer) y agrega
 * un encabezado propio de admin con el contenido de la sección activa.
 */

import { NavLink, Outlet } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    return (
        <div className="admin-page">
            <header className="admin-page__header">
                <div className="admin-page__container">
                    <span className="admin-page__label">Panel de administración</span>
                    <nav className="admin-page__nav">
                        <NavLink
                            to="/admin/presupuestos"
                            className={({ isActive }) =>
                                `admin-page__tab ${isActive ? 'admin-page__tab--active' : ''}`
                            }
                        >
                            Presupuestos
                        </NavLink>
                        <NavLink
                            to="/admin/combos"
                            className={({ isActive }) =>
                                `admin-page__tab ${isActive ? 'admin-page__tab--active' : ''}`
                            }
                        >
                            Combos
                        </NavLink>
                    </nav>
                </div>
            </header>
            <div className="admin-page__container">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPage;
