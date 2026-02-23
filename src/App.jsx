/**
 * App.jsx
 * Punto de entrada de la aplicación React.
 * Configura el RouterProvider y aplica los estilos globales.
 */

import { RouterProvider } from 'react-router-dom';
import router from './router';
import './styles/global.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
