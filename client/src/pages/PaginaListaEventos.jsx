import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/events";
import { Link } from "react-router-dom";

function formatFecha(fecha) {
  if (!fecha) return "";
  const dateObj = new Date(fecha);
  return dateObj.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function PaginaListaEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = async () => {
    try {
      const res = await getEvents();
      setEventos(res.data);
    } catch {
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este evento?")) {
      await deleteEvent(id);
      fetchEventos();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Eventos</h2>
          <Link to="/crear-evento" className="bg-gradient-to-tr from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition transform hover:scale-105">
            Crear Evento
          </Link>
        </div>
        {loading && <p className="text-white text-center">Cargando...</p>}
        {!loading && eventos.length === 0 && (
          <div className="bg-zinc-800 text-zinc-400 rounded-xl p-6 text-center shadow-inner">
            No hay eventos registrados.
          </div>
        )}
        <ul className="space-y-4">
          {eventos.map(ev => (
            <li key={ev._id} className="bg-white/5 backdrop-blur rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between shadow-xl border border-zinc-700 group transition hover:scale-[1.015] hover:shadow-2xl">
              <div>
                <div className="text-xl font-bold text-white group-hover:text-blue-400 transition">{ev.nombre}</div>
                <div className="text-zinc-300 text-sm">
                  <span className="font-medium text-blue-300">{formatFecha(ev.fecha)}</span>
                  {"  "}·{"  "}
                  <span>{ev.hora} h</span>
                  {"  "}·{"  "}
                  <span className="font-medium text-green-300">{ev.lugar}</span>
                </div>
                <div className="text-zinc-400 text-sm mt-1 italic">{ev.descripcion}</div>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <Link
                  to={`/eventos/${ev._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                >
                  Gestionar
                </Link>
                <button
                  onClick={() => handleDelete(ev._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PaginaListaEventos;
