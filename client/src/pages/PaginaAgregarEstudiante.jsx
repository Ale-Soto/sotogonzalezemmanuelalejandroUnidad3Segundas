import { useForm } from "react-hook-form";
import { createEstudiante } from "../api/estudiantes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PaginaAgregarEstudiante() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await createEstudiante(values);
      setMensaje("Estudiante registrado correctamente ✔️");
      reset();
      setTimeout(() => {
        setMensaje("");
        navigate("/estudiantes");
      }, 1600);
    } catch (error) {
      setMensaje(error.response?.data?.error || "Error al registrar estudiante");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur shadow-2xl rounded-2xl p-8 border border-zinc-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Agregar estudiante</h2>
        {mensaje && (
          <div className="mb-3 p-2 rounded text-white text-center font-semibold animate-pulse bg-blue-800">{mensaje}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("nombre", { required: "Nombre requerido" })}
            placeholder="Nombre completo"
            className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
          />
          {errors.nombre && <span className="text-red-400 text-sm">{errors.nombre.message}</span>}
          <input
            {...register("correo", { required: "Correo requerido" })}
            placeholder="Correo electrónico"
            type="email"
            className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
          />
          {errors.correo && <span className="text-red-400 text-sm">{errors.correo.message}</span>}
          <input
            {...register("matricula", { required: "Matrícula requerida" })}
            placeholder="Matrícula"
            className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
          />
          {errors.matricula && <span className="text-red-400 text-sm">{errors.matricula.message}</span>}
          <input
            {...register("carrera", { required: "Carrera requerida" })}
            placeholder="Carrera"
            className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
          />
          {errors.carrera && <span className="text-red-400 text-sm">{errors.carrera.message}</span>}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition transform hover:scale-105 active:scale-95"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaginaAgregarEstudiante;
