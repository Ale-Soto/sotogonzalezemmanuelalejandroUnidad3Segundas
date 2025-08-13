import QrAccessScanner from '../components/QrAccessScanner';
import axios from 'axios';
import { useState } from 'react';

function PaginaEscanearQR() {
  const [mensaje, setMensaje] = useState(null);
  const [tipo, setTipo] = useState("info"); // info, success, error

  const handleScanSuccess = async (idInvitado) => {
  try {
    const res = await axios.post('https://xzc4jsjl-4000.usw3.devtunnels.ms/acceso', { id_invitado: idInvitado });
    setMensaje(res.data.mensaje || '¡Asistencia registrada!');
  } catch (err) {
    setMensaje(err.response?.data?.mensaje || 'Error al registrar asistencia');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="bg-white/10 backdrop-blur-md shadow-2xl border border-zinc-700 rounded-2xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Escaneo de QR para acceso</h1>
        <p className="text-zinc-300 mb-4 text-center">Escanea el código QR de la invitación para registrar la asistencia.</p>
        <div className="w-full flex justify-center mb-2">
          <QrAccessScanner onScanSuccess={handleScanSuccess} />
        </div>
        {mensaje && (
          <div
            className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-center
              ${
                tipo === "success"
                  ? "bg-green-600 text-white animate-pulse"
                  : tipo === "error"
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-blue-700 text-white animate-pulse"
              }
            `}
            style={{ minHeight: "3rem" }}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginaEscanearQR;
