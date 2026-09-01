/**
 * AdminLoginPage.jsx
 * Página de entrada al panel de administración.
 * - Si ya es admin: redirige a /admin/presupuestos
 * - Si no: muestra el modal de login
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import AdminLoginModal from '../../components/layout/AdminLoginModal';

const AdminLoginPage = () => {
    const { isAdmin } = useAdmin();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(true);

    // Si ya está autenticado, redirigir al panel
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin/presupuestos', { replace: true });
        }
    }, [isAdmin, navigate]);

    // Manejar cierre del modal (si cancela, volver al home)
    const handleClose = () => {
        setShowModal(false);
        navigate('/', { replace: true });
    };

    // Al loguearse exitosamente, el modal se cierra solo (ver AdminLoginModal)
    // y el useEffect de arriba redirige a /admin/presupuestos

    return (
        <div className="admin-login-page">
            <AdminLoginModal
                isOpen={showModal}
                onClose={handleClose}
            />
        </div>
    );
};

export default AdminLoginPage;