import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
    // useRouteError atrapa cualquier error lanzado durante el renderizado de la ruta,
    // la carga de datos (loaders) o acciones (actions).
    const error = useRouteError();
    console.error("ErrorBoundary caught an error:", error);

    // Estilos inline genéricos para asegurar que se vea bien independientemente 
    // de si el CSS global cargó o no (útil cuando falla la red).
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#121212',
            color: '#f0f0f0',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1 style={{ marginBottom: '1rem', color: '#ff6b6b', fontSize: '2.5rem' }}>
                ¡Ups! Algo salió mal
            </h1>
            <p style={{ marginBottom: '2.5rem', maxWidth: '600px', lineHeight: '1.6', fontSize: '1.1rem', color: '#a0a0a0' }}>
                Parece que hubo un problema al cargar esta página. Esto suele ocurrir
                debido a una actualización en el sitio o un error de conexión a internet.
            </p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    padding: '0.8rem 1.8rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
                Recargar la página
            </button>
            
            {/* Solo muestra los detalles técnicos en modo desarrollo */}
            {import.meta.env.DEV && (
                <div style={{ 
                    marginTop: '3rem', 
                    padding: '1.5rem', 
                    backgroundColor: '#1e1e1e', 
                    borderRadius: '8px', 
                    textAlign: 'left', 
                    width: '100%', 
                    maxWidth: '800px', 
                    overflowX: 'auto',
                    border: '1px solid #333'
                }}>
                    <p style={{ color: '#ff8787', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                        Detalles técnicos (Solo visible en desarrollo):
                    </p>
                    <pre style={{ margin: 0, color: '#cccccc', fontSize: '0.9rem' }}>
                        {error.statusText || error.message || String(error)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ErrorBoundary;
