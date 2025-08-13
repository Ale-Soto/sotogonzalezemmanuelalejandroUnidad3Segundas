import { useEffect, useState } from "react";
import { getEventById, updateEvent } from "../api/events";
import { getEstudiantesNoInvitados  } from "../api/estudiantes";
import { crearInvitaciones } from "../api/invitados";
import { useParams, useNavigate } from "react-router";

function getIniciales(nombre) {
  return nombre.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PaginaGestionEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [estudiantes, setEstudiantes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filterCarrera, setFilterCarrera] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Obtener datos del evento y estudiantes
  useEffect(() => {
  getEventById(id).then(res => {
    setEvento(res.data);
    setForm(res.data);
  });
  getEstudiantesNoInvitados(id).then(res => setEstudiantes(res.data));
}, [id]);

  const handleEdit = () => setEdit(true);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async (e) => {
    e.preventDefault();
    await updateEvent(id, form);
    setEdit(false);
    setMensaje("✅ Evento actualizado");
    setTimeout(() => setMensaje(""), 1800);
  };

  // Invitar estudiantes seleccionados
  const handleInvitar = async () => {
  if (selected.length === 0) {
    setMensaje("Selecciona al menos un estudiante.");
    return;
  }
  try {
    // Crear invitaciones en lote
    await crearInvitaciones(id, selected);

    // Mostrar mensaje de éxito
    setMensaje("🎉 ¡Invitaciones guardadas!");

    // Limpiar selección
    setSelected([]);

    // Refrescar la lista de estudiantes no invitados
    const res = await getEstudiantesNoInvitados(id);
    setEstudiantes(res.data);

    setTimeout(() => setMensaje(""), 2000);
  } catch (error) {
    console.error("Error creando invitaciones:", error.response ? error.response.data : error.message);
    setMensaje("Error al guardar la invitación");
    setTimeout(() => setMensaje(""), 2000);
  }
};

  // Filtrar estudiantes
  const estudiantesFiltrados = filterCarrera
    ? estudiantes.filter(e => e.carrera === filterCarrera)
    : estudiantes;

  const carrerasUnicas = [...new Set(estudiantes.map(e => e.carrera))];

  const toggleAll = () => {
    if (selected.length === estudiantesFiltrados.length) {
      setSelected([]);
    } else {
      setSelected(estudiantesFiltrados.map(e => e._id));
    }
  };

  const toggleOne = (id_estudiante) => {
    setSelected(prev =>
      prev.includes(id_estudiante)
        ? prev.filter(id => id !== id_estudiante)
        : [...prev, id_estudiante]
    );
  };

  if (!evento) return <div className="text-white text-center mt-10">Cargando evento...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-10">
      <div className="max-w-3xl mx-auto rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-zinc-700 p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Gestionar evento</h2>
          <button onClick={() => navigate("/eventos")} className="text-blue-400 hover:underline text-sm">
            ← Regresar
          </button>
        </div>
        {mensaje && <div className="mb-3 p-2 bg-blue-800 rounded text-white text-center font-semibold animate-pulse">{mensaje}</div>}

        {/* Formulario para editar evento */}
        <form className="space-y-3 mb-10" onSubmit={handleSave}>
        <input
            disabled={!edit}
            name="nombre"
            value={form.nombre || ""}
            onChange={handleChange}
            className={`w-full py-2 px-4 rounded-xl bg-zinc-800/80 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition font-bold text-lg tracking-wide ${!edit && "opacity-60 cursor-not-allowed"}`}
            placeholder="Nombre del evento"
        />
        <input
            disabled={!edit}
            name="descripcion"
            value={form.descripcion || ""}
            onChange={handleChange}
            className={`w-full py-2 px-4 rounded-xl bg-zinc-800/80 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition ${!edit && "opacity-60 cursor-not-allowed"}`}
            placeholder="Descripción"
        />
        <div className="flex gap-3">
            <input
            disabled={!edit}
            name="fecha"
            type="date"
            value={form.fecha ? form.fecha.slice(0,10) : ""}
            onChange={handleChange}
            className={`w-1/2 py-2 px-4 rounded-xl bg-zinc-800/80 border border-zinc-600 text-white focus:outline-none focus:border-blue-500 transition ${!edit && "opacity-60 cursor-not-allowed"}`}
            />
            <input
            disabled={!edit}
            name="hora"
            type="time"
            value={form.hora || ""}
            onChange={handleChange}
            className={`w-1/2 py-2 px-4 rounded-xl bg-zinc-800/80 border border-zinc-600 text-white focus:outline-none focus:border-blue-500 transition ${!edit && "opacity-60 cursor-not-allowed"}`}
            />
        </div>
        <input
            disabled={!edit}
            name="lugar"
            value={form.lugar || ""}
            onChange={handleChange}
            className={`w-full py-2 px-4 rounded-xl bg-zinc-800/80 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition ${!edit && "opacity-60 cursor-not-allowed"}`}
            placeholder="Lugar"
        />
        {edit && (
            <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-xl font-bold text-white transition"
            >
            Guardar cambios
            </button>
        )}
        </form>

        {/* Botón de editar solo cuando NO está en modo edición */}
        {!edit && (
        <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-bold text-white transition mb-8"
            onClick={handleEdit}
        >
            Editar evento
        </button>
        )}



        {/* GESTIÓN DE INVITADOS */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-white mb-3">Agregar invitados</h3>
          {/* Filtro por carrera */}
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <label className="text-zinc-300 font-medium">Filtrar por carrera:</label>
            <select className="bg-zinc-800 text-white rounded p-1" value={filterCarrera} onChange={e => setFilterCarrera(e.target.value)}>
              <option value="">Todas</option>
              {carrerasUnicas.map(carr => (
                <option key={carr} value={carr}>{carr}</option>
              ))}
            </select>
            <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl text-sm transition"
              type="button" onClick={toggleAll}>
              {selected.length === estudiantesFiltrados.length ? "Desmarcar todos" : "Seleccionar todos"}
            </button>
          </div>
          {/* Catálogo de estudiantes */}
          <div className="max-h-72 overflow-auto rounded-lg border border-zinc-700 shadow-inner bg-white/5 mt-2">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="bg-zinc-900 sticky top-0 z-10">
                  <th className="p-2"></th>
                  <th className="p-2 text-left">Alumno</th>
                  <th className="p-2 text-left">Matrícula</th>
                  <th className="p-2 text-left">Carrera</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.map(est => (
                  <tr key={est._id} className="hover:bg-blue-900/30 transition">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(est._id)}
                        onChange={() => toggleOne(est._id)}
                        className="accent-blue-500"
                      />
                    </td>
                    <td className="p-2 flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold text-base shadow">{getIniciales(est.nombre)}</span>
                      <span>{est.nombre}</span>
                    </td>
                    <td className="p-2 font-mono">{est.matricula}</td>
                    <td className="p-2">{est.carrera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleInvitar}
            className="mt-4 w-full py-2 rounded-xl bg-gradient-to-tr from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-bold shadow-md transition transform hover:scale-105 active:scale-95">
            Guardar Invitaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginaGestionEvento;
