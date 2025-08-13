import { useForm } from "react-hook-form";
import { createEvent } from "../api/events";
import { useNavigate } from "react-router-dom";

function PaginaCrearEvento() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await createEvent(values);
      reset();
      navigate("/eventos");
    } catch (error) {
      alert("Error al crear evento");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center tracking-tight">Crear nuevo evento</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register("nombre", { required: "Nombre requerido" })}
              placeholder="Nombre del evento"
              className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
              autoFocus
            />
            {errors.nombre && <span className="text-red-400 text-sm">{errors.nombre.message}</span>}
          </div>
          <div>
            <input
              {...register("descripcion")}
              placeholder="Descripción"
              className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="flex gap-3">
            <input
              {...register("fecha", { required: "Fecha requerida" })}
              type="date"
              className="w-1/2 py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              {...register("hora", { required: "Hora requerida" })}
              type="time"
              className="w-1/2 py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <input
              {...register("lugar", { required: "Lugar requerido" })}
              placeholder="Lugar"
              className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
            />
            {errors.lugar && <span className="text-red-400 text-sm">{errors.lugar.message}</span>}
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition transform hover:scale-105 active:scale-95"
          >
            Crear Evento
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaginaCrearEvento;
