/**
 * AdminRoute.jsx
 * Guarda de acceso para rutas exclusivas de administración.
 * Si el usuario es admin, renderiza los children; si no, muestra el
 * modal de login de admin y oculta el contenido protegido.
 */

import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminLoginModal from '../layout/AdminLoginModal';

const AdminRoute = ({ children }) => {
    const { isAdmin } = useAdmin();
    const [dismissed, setDismissed] = useState(false);

    if (isAdmin) {
        return children;
    }

    const showModal = !dismissed;

    return (
        <AdminLoginModal
            isOpen={showModal}
            onClose={() => setDismissed(true)}
        />
    );
};

export default AdminRoute;
