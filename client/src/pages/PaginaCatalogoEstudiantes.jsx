import { useEffect, useState } from "react";
import { getEstudiantes } from "../api/estudiantes";
import { Link } from "react-router-dom";

// Utilidad para iniciales
function getIniciales(nombre) {
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PaginaCatalogoEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEstudiantes()
      .then((res) => setEstudiantes(res.data))
      .catch(() => setEstudiantes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-8">
      <div className="w-full max-w-3xl">
        {/* Título + botón responsivo */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white text-center md:text-left tracking-tight">
            Catálogo de Estudiantes
          </h2>
          <Link
            to="/agregar-estudiante"
            className="bg-gradient-to-tr from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition transform hover:scale-105 text-center"
          >
            + Agregar estudiante
          </Link>
        </div>
        {loading && <p className="text-white text-center">Cargando...</p>}
        {!loading && estudiantes.length === 0 && (
          <div className="bg-zinc-800 text-zinc-400 rounded-xl p-6 text-center shadow-inner">
            No hay estudiantes registrados.
          </div>
        )}
        <ul className="grid md:grid-cols-2 gap-6">
          {estudiantes.map((est) => (
            <li
              key={est._id}
              className="bg-white/5 backdrop-blur rounded-2xl px-6 py-5 flex items-center shadow-xl border border-zinc-700 group transition hover:scale-[1.025] hover:shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-400 text-white text-2xl font-bold shadow-lg mr-5">
                {getIniciales(est.nombre)}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white group-hover:text-blue-300 transition">
                  {est.nombre}
                </div>
                <div className="text-zinc-300 text-sm flex gap-3">
                  <span className="font-medium">Matrícula:</span>
                  <span className="font-mono">{est.matricula}</span>
                </div>
                <div className="text-zinc-400 text-sm">
                  <span className="font-medium">Carrera:</span> {est.carrera}
                </div>
                <div className="text-zinc-400 text-sm truncate">
                  <span className="font-medium">Correo:</span> {est.correo}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PaginaCatalogoEstudiantes;
