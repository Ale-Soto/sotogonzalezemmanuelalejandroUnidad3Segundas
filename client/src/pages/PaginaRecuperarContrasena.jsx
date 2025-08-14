import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

function PaginaRecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Ingresar email, 2: Ingresar token, 3: Nueva contraseña
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Si viene con token en la URL
  const urlToken = searchParams.get('token');
  if (urlToken && step === 1) {
    setToken(urlToken);
    setStep(2);
  }

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/forgot-password', { email });
      setStep(2);
    } catch (error) {
      setErrors([error.response?.data?.message || "Error al solicitar recuperación"]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrors(["Ingresa el código de verificación"]);
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrors(["Las contraseñas no coinciden"]);
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/reset-password', { token, newPassword });
      navigate('/', { state: { success: "Contraseña actualizada correctamente" } });
    } catch (error) {
      setErrors([error.response?.data?.message || "Error al actualizar contraseña"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur shadow-2xl rounded-2xl p-6 border border-zinc-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">
          {step === 1 ? 'Recuperar Contraseña' : step === 2 ? 'Verificar Código' : 'Nueva Contraseña'}
        </h2>
        
        {errors.length > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 text-center">
            {errors[0]}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestToken}>
            <div className="mb-4">
              <label className="block text-white mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyToken}>
            <div className="mb-4">
              <label className="block text-white mb-2">Código de Verificación</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full py-3 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
                placeholder="Ingresa el código enviado a tu correo"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition"
            >
              Verificar Código
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-white mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-3 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
                required
                minLength="6"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-4 focus:outline-none transition-colors text-sm"
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginaRecuperarContrasena;