import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaginaNoAutorizado() {
  const location = useLocation();
  const navigate = useNavigate();
  const { blocked, message } = location.state || {};

  useEffect(() => {
    if (blocked) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [blocked, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {blocked ? 'Cuenta bloqueada' : 'Acceso no autorizado'}
        </h1>
        <p className="mb-4">{message}</p>
        {!blocked && (
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver a la página principal
          </button>
        )}
      </div>
    </div>
  );
}

export default PaginaNoAutorizado;